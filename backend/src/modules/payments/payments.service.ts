import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentTransactionStatus } from './entities/payment.entity';
import { Promotion, PromotionType } from './entities/promotion.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Promotion) private promoRepo: Repository<Promotion>,
  ) {}

  async createPayment(orderId: string, amount: number, method: string) {
    const payment = this.paymentRepo.create({
      order_id: orderId,
      amount,
      method,
      status: method === 'cash' ? PaymentTransactionStatus.PENDING : PaymentTransactionStatus.PENDING,
    });
    return this.paymentRepo.save(payment);
  }

  async getPaymentsByOrder(orderId: string) {
    return this.paymentRepo.find({ where: { order_id: orderId } });
  }

  async getAllPayments(page = 1, limit = 20) {
    const [payments, total] = await this.paymentRepo.findAndCount({
      relations: ['order'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { payments, total, page, limit };
  }

  async validatePromoCode(code: string, orderAmount: number) {
    const promo = await this.promoRepo.findOne({ where: { code, is_active: true } });
    if (!promo) return { valid: false, message: 'Invalid promo code' };
    if (new Date() > promo.expires_at) return { valid: false, message: 'Promo code expired' };
    if (promo.max_uses && promo.used_count >= promo.max_uses) return { valid: false, message: 'Promo code limit reached' };
    if (orderAmount < Number(promo.min_order_amount)) return { valid: false, message: `Minimum order amount is ${promo.min_order_amount}` };

    let discount = 0;
    if (promo.type === PromotionType.PERCENTAGE) {
      discount = orderAmount * (Number(promo.value) / 100);
      if (promo.max_discount) discount = Math.min(discount, Number(promo.max_discount));
    } else if (promo.type === PromotionType.FIXED_AMOUNT) {
      discount = Number(promo.value);
    }

    return { valid: true, discount, promo };
  }

  async createPromotion(data: Partial<Promotion>) {
    return this.promoRepo.save(this.promoRepo.create(data));
  }

  async getAllPromotions() {
    return this.promoRepo.find({ order: { created_at: 'DESC' } });
  }

  async updatePromotion(id: string, data: Partial<Promotion>) {
    await this.promoRepo.update(id, data);
    return this.promoRepo.findOne({ where: { id } });
  }

  async deletePromotion(id: string) {
    await this.promoRepo.delete(id);
    return { deleted: true };
  }
}
