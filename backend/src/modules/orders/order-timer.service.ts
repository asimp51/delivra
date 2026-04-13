import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { DeliveryAssignment, AssignmentStatus } from '../delivery/entities/delivery-assignment.entity';

/**
 * Order Timer Service — handles automatic timeouts
 *
 * Runs every 30 seconds and checks:
 * 1. Vendor didn't respond within 5 minutes → auto-cancel order
 * 2. Rider didn't accept within 60 seconds → reassign to next rider
 * 3. Order stuck in preparing for 60+ minutes → alert admin
 *
 * In production, use BullMQ job queue instead of setInterval
 * for reliability across server restarts.
 */
@Injectable()
export class OrderTimerService implements OnModuleInit {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(DeliveryAssignment) private assignmentRepo: Repository<DeliveryAssignment>,
  ) {}

  onModuleInit() {
    // Run every 30 seconds
    setInterval(() => this.checkTimeouts(), 30000);
    console.log('[OrderTimer] Auto-cancel and rider timeout checks started');
  }

  private async checkTimeouts() {
    await this.checkVendorTimeout();
    await this.checkRiderTimeout();
    await this.checkStuckOrders();
  }

  /**
   * Auto-cancel orders if vendor doesn't respond in 5 minutes
   */
  private async checkVendorTimeout() {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

    const staleOrders = await this.orderRepo.find({
      where: {
        status: OrderStatus.PENDING,
        created_at: LessThan(fiveMinAgo),
      },
    });

    for (const order of staleOrders) {
      order.status = OrderStatus.CANCELLED;
      order.cancelled_by = 'system';
      order.cancel_reason = 'Vendor did not respond within 5 minutes';
      await this.orderRepo.save(order);
      console.log(`[OrderTimer] Auto-cancelled ${order.order_number} — vendor timeout`);

      // TODO: Send push notification to customer
      // TODO: Refund if paid by card
    }
  }

  /**
   * Reassign delivery if rider doesn't accept within 60 seconds
   */
  private async checkRiderTimeout() {
    const oneMinAgo = new Date(Date.now() - 60 * 1000);

    const staleAssignments = await this.assignmentRepo.find({
      where: {
        status: AssignmentStatus.OFFERED,
        offered_at: LessThan(oneMinAgo),
      },
    });

    for (const assignment of staleAssignments) {
      assignment.status = AssignmentStatus.REJECTED;
      await this.assignmentRepo.save(assignment);
      console.log(`[OrderTimer] Rider timeout — reassigning order ${assignment.order_id}`);

      // TODO: Find next nearest rider and create new assignment
      // TODO: If no riders available after 3 attempts, notify admin
    }
  }

  /**
   * Alert if order stuck in preparing for 60+ minutes
   */
  private async checkStuckOrders() {
    const sixtyMinAgo = new Date(Date.now() - 60 * 60 * 1000);

    const stuck = await this.orderRepo.count({
      where: {
        status: OrderStatus.PREPARING,
        updated_at: LessThan(sixtyMinAgo),
      },
    });

    if (stuck > 0) {
      console.log(`[OrderTimer] WARNING: ${stuck} orders stuck in 'preparing' for 60+ minutes`);
      // TODO: Notify admin via push/email
    }
  }
}
