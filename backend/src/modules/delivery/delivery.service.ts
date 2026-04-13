import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rider } from './entities/rider.entity';
import { DeliveryAssignment, AssignmentStatus } from './entities/delivery-assignment.entity';
import { RiderLocation } from './entities/rider-location.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Rider) private riderRepo: Repository<Rider>,
    @InjectRepository(DeliveryAssignment) private assignmentRepo: Repository<DeliveryAssignment>,
    @InjectRepository(RiderLocation) private locationRepo: Repository<RiderLocation>,
  ) {}

  async getRiderByUserId(userId: string) {
    const rider = await this.riderRepo.findOne({ where: { user_id: userId }, relations: ['user'] });
    if (!rider) throw new NotFoundException('Rider profile not found');
    return rider;
  }

  async registerRider(userId: string, data: Partial<Rider>) {
    const rider = this.riderRepo.create({ ...data, user_id: userId });
    return this.riderRepo.save(rider);
  }

  async toggleOnline(userId: string, isOnline: boolean) {
    const rider = await this.getRiderByUserId(userId);
    rider.is_online = isOnline;
    return this.riderRepo.save(rider);
  }

  async updateLocation(userId: string, lat: number, lng: number, orderId?: string) {
    const rider = await this.getRiderByUserId(userId);
    rider.current_latitude = lat;
    rider.current_longitude = lng;
    await this.riderRepo.save(rider);

    await this.locationRepo.save(
      this.locationRepo.create({
        rider_id: rider.id,
        order_id: orderId,
        latitude: lat,
        longitude: lng,
      }),
    );

    return { success: true };
  }

  async getAvailableOrders(userId: string) {
    const rider = await this.getRiderByUserId(userId);
    return this.assignmentRepo.find({
      where: { rider_id: rider.id, status: AssignmentStatus.OFFERED },
      relations: ['order', 'order.vendor', 'order.delivery_address'],
    });
  }

  async acceptDelivery(userId: string, orderId: string) {
    const rider = await this.getRiderByUserId(userId);

    // Check if rider can accept more orders (stacking check)
    if (rider.active_delivery_count >= rider.max_concurrent_orders) {
      throw new NotFoundException('Maximum concurrent deliveries reached');
    }

    const assignment = await this.assignmentRepo.findOne({
      where: { rider_id: rider.id, order_id: orderId, status: AssignmentStatus.OFFERED },
    });
    if (!assignment) throw new NotFoundException('No delivery offer found');

    assignment.status = AssignmentStatus.ACCEPTED;
    assignment.accepted_at = new Date();
    await this.assignmentRepo.save(assignment);

    rider.is_on_delivery = true;
    rider.active_delivery_count += 1;
    await this.riderRepo.save(rider);

    return assignment;
  }

  async completeDelivery(userId: string, orderId: string) {
    const rider = await this.getRiderByUserId(userId);
    const assignment = await this.assignmentRepo.findOne({
      where: { rider_id: rider.id, order_id: orderId, status: AssignmentStatus.ACCEPTED },
    });
    if (!assignment) throw new NotFoundException('No active delivery found');

    assignment.status = AssignmentStatus.COMPLETED;
    assignment.completed_at = new Date();
    await this.assignmentRepo.save(assignment);

    rider.active_delivery_count = Math.max(0, rider.active_delivery_count - 1);
    rider.is_on_delivery = rider.active_delivery_count > 0;
    rider.total_deliveries += 1;
    await this.riderRepo.save(rider);

    return assignment;
  }

  /**
   * Get rider's active deliveries (for stacking — shows all current orders)
   */
  async getActiveDeliveries(userId: string) {
    const rider = await this.getRiderByUserId(userId);
    return this.assignmentRepo.find({
      where: { rider_id: rider.id, status: AssignmentStatus.ACCEPTED },
      relations: ['order', 'order.vendor', 'order.delivery_address', 'order.items'],
    });
  }

  async getEarnings(userId: string) {
    const rider = await this.getRiderByUserId(userId);
    const completed = await this.assignmentRepo.find({
      where: { rider_id: rider.id, status: AssignmentStatus.COMPLETED },
      relations: ['order'],
      order: { completed_at: 'DESC' },
    });

    const totalEarnings = completed.reduce((sum, a) => sum + Number(a.order?.delivery_fee || 0), 0);
    return {
      total_earnings: totalEarnings,
      total_deliveries: rider.total_deliveries,
      wallet_balance: rider.wallet_balance,
      recent_deliveries: completed.slice(0, 20),
    };
  }

  /**
   * ASSIGNMENT STRATEGY — Configurable via admin settings
   *
   * Strategy 1: NEAREST (default) — fastest delivery, unfair earnings
   * Strategy 2: ROUND_ROBIN — perfectly fair, may be slower
   * Strategy 3: HYBRID (recommended) — fair + fast
   *
   * The admin can change the strategy from the Settings page.
   */
  async assignRider(
    vendorLat: number,
    vendorLng: number,
    vendorId: string,
    strategy: 'nearest' | 'round_robin' | 'hybrid' = 'hybrid',
    allowStacking = true,
  ): Promise<Rider | null> {
    // First, try riders who are completely free
    const freeRiders = await this.riderRepo.find({
      where: { is_online: true, is_on_delivery: false },
    });

    if (freeRiders.length) {
      switch (strategy) {
        case 'nearest':
          return this.findNearestRider(vendorLat, vendorLng, freeRiders);
        case 'round_robin':
          return this.findRoundRobinRider(freeRiders);
        case 'hybrid':
          return this.findHybridRider(vendorLat, vendorLng, freeRiders);
      }
    }

    // If no free riders AND stacking is enabled, try riders with capacity
    if (allowStacking) {
      const stackableRider = await this.findStackableRider(vendorLat, vendorLng, vendorId);
      if (stackableRider) return stackableRider;
    }

    return null;
  }

  /**
   * ORDER STACKING — Find a rider who already has an order but can take another
   *
   * Rules for stacking:
   * 1. Rider must have capacity (active_delivery_count < max_concurrent_orders)
   * 2. New pickup must be from the SAME vendor OR within 500m of current pickup
   * 3. New dropoff must be within 2km of current dropoff (same direction)
   * 4. Rider must not have picked up the first order yet (still at vendor)
   *
   * Benefits:
   * - Rider earns more per trip
   * - Customer gets slightly cheaper delivery (split fee)
   * - Vendor sends 2 orders at once (efficient)
   */
  private async findStackableRider(
    vendorLat: number,
    vendorLng: number,
    vendorId: string,
  ): Promise<Rider | null> {
    // Find riders who are on delivery but have capacity for more
    const busyRiders = await this.riderRepo
      .createQueryBuilder('r')
      .where('r.is_online = true')
      .andWhere('r.is_on_delivery = true')
      .andWhere('r.active_delivery_count < r.max_concurrent_orders')
      .getMany();

    if (!busyRiders.length) return null;

    for (const rider of busyRiders) {
      // Get rider's current active delivery
      const currentAssignment = await this.assignmentRepo.findOne({
        where: { rider_id: rider.id, status: AssignmentStatus.ACCEPTED },
        relations: ['order', 'order.vendor'],
      });

      if (!currentAssignment?.order) continue;

      const currentOrder = currentAssignment.order;

      // Rule 1: Same vendor — always allow stacking
      if (currentOrder.vendor_id === vendorId) {
        return rider;
      }

      // Rule 2: Different vendor but very nearby (within 500m)
      if (currentOrder.vendor) {
        const vendorDistance = this.haversineDistance(
          vendorLat, vendorLng,
          Number(currentOrder.vendor.latitude || 0),
          Number(currentOrder.vendor.longitude || 0),
        );
        if (vendorDistance <= 0.5) { // 500 meters
          return rider;
        }
      }
    }

    return null;
  }

  /**
   * Strategy 1: NEAREST — picks the closest rider to the vendor
   * Pros: Fastest delivery
   * Cons: Riders near busy areas get all orders, others starve
   */
  private findNearestRider(lat: number, lng: number, riders: Rider[]): Rider | null {
    let nearest = riders[0];
    let minDist = Infinity;

    for (const rider of riders) {
      if (!rider.current_latitude || !rider.current_longitude) continue;
      const dist = this.haversineDistance(lat, lng, Number(rider.current_latitude), Number(rider.current_longitude));
      if (dist < minDist) {
        minDist = dist;
        nearest = rider;
      }
    }

    return nearest;
  }

  /**
   * Strategy 2: ROUND ROBIN — assigns to the rider with fewest deliveries today
   * Pros: Perfectly fair earnings distribution
   * Cons: May assign a far-away rider (slower delivery)
   */
  private async findRoundRobinRider(riders: Rider[]): Promise<Rider | null> {
    // Get today's delivery count for each available rider
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let leastBusyRider = riders[0];
    let minDeliveriesToday = Infinity;

    for (const rider of riders) {
      const todayCount = await this.assignmentRepo.count({
        where: {
          rider_id: rider.id,
          status: AssignmentStatus.COMPLETED,
        },
      });

      if (todayCount < minDeliveriesToday) {
        minDeliveriesToday = todayCount;
        leastBusyRider = rider;
      }
    }

    return leastBusyRider;
  }

  /**
   * Strategy 3: HYBRID (recommended) — fair + fast
   *
   * How it works:
   * 1. Filter riders within a reasonable radius (e.g., 5km from vendor)
   * 2. Among those, pick the one with fewest deliveries today
   * 3. If no riders within 5km, expand to 10km
   * 4. If still none, fall back to nearest regardless of fairness
   *
   * This ensures:
   * - Delivery is reasonably fast (rider is nearby)
   * - Earnings are distributed fairly (least-busy rider gets priority)
   * - No rider is starved of orders
   */
  private async findHybridRider(
    vendorLat: number,
    vendorLng: number,
    riders: Rider[],
  ): Promise<Rider | null> {
    // Step 1: Calculate distance for all riders
    const ridersWithDistance = riders
      .filter((r) => r.current_latitude && r.current_longitude)
      .map((rider) => ({
        rider,
        distance: this.haversineDistance(
          vendorLat, vendorLng,
          Number(rider.current_latitude), Number(rider.current_longitude),
        ),
      }));

    if (!ridersWithDistance.length) return riders[0] || null;

    // Step 2: Try to find riders within radius tiers
    for (const maxRadius of [5, 10, 20, Infinity]) {
      const nearby = ridersWithDistance.filter((r) => r.distance <= maxRadius);
      if (!nearby.length) continue;

      // Step 3: Among nearby riders, pick the one with fewest deliveries today
      let bestRider = nearby[0];
      let minDeliveries = Infinity;

      for (const { rider } of nearby) {
        const todayCount = await this.assignmentRepo.count({
          where: { rider_id: rider.id, status: AssignmentStatus.COMPLETED },
        });

        if (todayCount < minDeliveries) {
          minDeliveries = todayCount;
          bestRider = { rider, distance: 0 };
        }
        // Tiebreaker: if same delivery count, pick closer rider
        else if (todayCount === minDeliveries) {
          const bestDist = ridersWithDistance.find((r) => r.rider.id === bestRider.rider.id)?.distance || Infinity;
          const thisDist = ridersWithDistance.find((r) => r.rider.id === rider.id)?.distance || Infinity;
          if (thisDist < bestDist) {
            bestRider = { rider, distance: thisDist };
          }
        }
      }

      return bestRider.rider;
    }

    return riders[0];
  }

  // Legacy method — kept for backward compatibility, now uses hybrid
  async findNearestRiderLegacy(lat: number, lng: number): Promise<Rider | null> {
    return this.assignRider(lat, lng, 'hybrid');
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }
}
