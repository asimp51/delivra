import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { Review } from './entities/review.entity';
import { VendorItem } from '../vendors/entities/vendor-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory) private historyRepo: Repository<OrderStatusHistory>,
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    @InjectRepository(VendorItem) private vendorItemRepo: Repository<VendorItem>,
  ) {}

  async create(customerId: string, dto: CreateOrderDto) {
    let subtotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of dto.items) {
      const vendorItem = await this.vendorItemRepo.findOne({ where: { id: item.vendor_item_id } });
      if (!vendorItem) throw new NotFoundException(`Item ${item.vendor_item_id} not found`);

      const unitPrice = Number(vendorItem.discounted_price || vendorItem.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        vendor_item_id: item.vendor_item_id,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        special_instructions: item.special_instructions,
        selected_options: item.selected_options || [],
      });
    }

    const deliveryFee = 3.00;
    const taxAmount = subtotal * 0.05;
    const total = subtotal + deliveryFee + taxAmount;

    const orderNumber = `DLV-${Date.now().toString(36).toUpperCase()}`;

    const order = this.orderRepo.create({
      order_number: orderNumber,
      customer_id: customerId,
      vendor_id: dto.vendor_id,
      delivery_address_id: dto.delivery_address_id,
      status: OrderStatus.PENDING,
      subtotal,
      delivery_fee: deliveryFee,
      tax_amount: taxAmount,
      total,
      payment_method: dto.payment_method || PaymentMethod.CASH,
      payment_status: dto.payment_method === PaymentMethod.CASH ? PaymentStatus.PENDING : PaymentStatus.PENDING,
      special_instructions: dto.special_instructions,
    });

    const savedOrder = await this.orderRepo.save(order);

    const items = orderItems.map((item) =>
      this.orderItemRepo.create({ ...item, order_id: savedOrder.id }),
    );
    await this.orderItemRepo.save(items);

    await this.addStatusHistory(savedOrder.id, OrderStatus.PENDING, customerId, 'Order placed');

    return this.getById(savedOrder.id);
  }

  async getById(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.vendor_item', 'vendor', 'customer', 'delivery_address', 'status_history'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getCustomerOrders(customerId: string) {
    return this.orderRepo.find({
      where: { customer_id: customerId },
      relations: ['vendor', 'items'],
      order: { created_at: 'DESC' },
    });
  }

  async getVendorOrders(vendorId: string, status?: OrderStatus) {
    const where: any = { vendor_id: vendorId };
    if (status) where.status = status;
    return this.orderRepo.find({
      where,
      relations: ['items', 'items.vendor_item', 'customer', 'delivery_address'],
      order: { created_at: 'DESC' },
    });
  }

  async getAllOrders(filters?: { status?: string; page?: number; limit?: number }) {
    const qb = this.orderRepo.createQueryBuilder('o')
      .leftJoinAndSelect('o.vendor', 'v')
      .leftJoinAndSelect('o.customer', 'c')
      .leftJoinAndSelect('o.items', 'i');

    if (filters?.status) {
      qb.where('o.status = :status', { status: filters.status });
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    qb.skip((page - 1) * limit).take(limit).orderBy('o.created_at', 'DESC');

    const [orders, total] = await qb.getManyAndCount();
    return { orders, total, page, limit };
  }

  async updateStatus(orderId: string, status: OrderStatus, changedBy: string, note?: string) {
    const order = await this.getById(orderId);
    order.status = status;
    if (status === OrderStatus.DELIVERED) {
      order.actual_delivery = new Date();
    }
    await this.orderRepo.save(order);
    await this.addStatusHistory(orderId, status, changedBy, note);
    return this.getById(orderId);
  }

  async cancelOrder(orderId: string, userId: string, reason?: string) {
    const order = await this.getById(orderId);
    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
      throw new BadRequestException('Cannot cancel this order');
    }
    order.status = OrderStatus.CANCELLED;
    order.cancelled_by = userId;
    order.cancel_reason = reason;
    await this.orderRepo.save(order);
    await this.addStatusHistory(orderId, OrderStatus.CANCELLED, userId, reason);
    return order;
  }

  async rateOrder(orderId: string, customerId: string, data: { vendor_rating: number; rider_rating?: number; comment?: string }) {
    const order = await this.getById(orderId);
    if (order.status !== OrderStatus.DELIVERED) throw new BadRequestException('Can only rate delivered orders');

    const review = this.reviewRepo.create({
      order_id: orderId,
      customer_id: customerId,
      vendor_id: order.vendor_id,
      rider_id: order.rider_id,
      ...data,
    });
    return this.reviewRepo.save(review);
  }

  private async addStatusHistory(orderId: string, status: string, changedBy: string, note?: string) {
    const history = this.historyRepo.create({ order_id: orderId, status, changed_by: changedBy, note });
    await this.historyRepo.save(history);
  }
}
