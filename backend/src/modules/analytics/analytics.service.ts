import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { User } from '../auth/entities/user.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Rider } from '../delivery/entities/rider.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
    @InjectRepository(Rider) private riderRepo: Repository<Rider>,
  ) {}

  async getDashboardKPIs() {
    const totalOrders = await this.orderRepo.count();
    const deliveredOrders = await this.orderRepo.count({ where: { status: OrderStatus.DELIVERED } });
    const totalCustomers = await this.userRepo.count({ where: { role: 'customer' as any } });
    const totalVendors = await this.vendorRepo.count();
    const totalRiders = await this.riderRepo.count();
    const activeRiders = await this.riderRepo.count({ where: { is_online: true } });

    const revenueResult = await this.orderRepo
      .createQueryBuilder('o')
      .select('SUM(o.total)', 'total_revenue')
      .where('o.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();

    return {
      total_orders: totalOrders,
      delivered_orders: deliveredOrders,
      total_revenue: Number(revenueResult?.total_revenue || 0),
      total_customers: totalCustomers,
      total_vendors: totalVendors,
      total_riders: totalRiders,
      active_riders: activeRiders,
    };
  }

  async getRevenueChart(days = 30) {
    const result = await this.orderRepo
      .createQueryBuilder('o')
      .select("DATE(o.created_at)", 'date')
      .addSelect('SUM(o.total)', 'revenue')
      .addSelect('COUNT(*)', 'orders')
      .where('o.status = :status', { status: OrderStatus.DELIVERED })
      .andWhere('o.created_at >= NOW() - :interval::interval', { interval: `${days} days` })
      .groupBy('DATE(o.created_at)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return result;
  }

  async getOrdersByCategory() {
    const result = await this.orderRepo
      .createQueryBuilder('o')
      .leftJoin('o.vendor', 'v')
      .leftJoin('v.category', 'c')
      .select('c.name', 'category')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(o.total)', 'revenue')
      .groupBy('c.name')
      .getRawMany();

    return result;
  }

  async getVendorAnalytics(vendorId: string) {
    const totalOrders = await this.orderRepo.count({ where: { vendor_id: vendorId } });
    const deliveredOrders = await this.orderRepo.count({ where: { vendor_id: vendorId, status: OrderStatus.DELIVERED } });

    const revenueResult = await this.orderRepo
      .createQueryBuilder('o')
      .select('SUM(o.total)', 'revenue')
      .where('o.vendor_id = :vid', { vid: vendorId })
      .andWhere('o.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();

    return {
      total_orders: totalOrders,
      delivered_orders: deliveredOrders,
      total_revenue: Number(revenueResult?.revenue || 0),
    };
  }
}
