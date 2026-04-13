import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { PriceLock } from './entities/price-lock.entity';
import { VendorItem } from '../vendors/entities/vendor-item.entity';

@Injectable()
export class PriceLockService {
  constructor(
    @InjectRepository(PriceLock) private lockRepo: Repository<PriceLock>,
    @InjectRepository(VendorItem) private itemRepo: Repository<VendorItem>,
  ) {}

  async lockPrices(userId: string, vendorId: string) {
    // Check if user already has an active lock for this vendor
    const existing = await this.lockRepo.findOne({
      where: { user_id: userId, vendor_id: vendorId, is_used: false, expires_at: MoreThan(new Date()) },
    });
    if (existing) return existing;

    // Check monthly limit (3 free per month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthlyCount = await this.lockRepo.count({
      where: { user_id: userId },
    });
    if (monthlyCount >= 3) {
      throw new BadRequestException('Free price lock limit reached (3/month). Premium lock: $0.99');
    }

    // Snapshot all item prices
    const items = await this.itemRepo.find({ where: { vendor_id: vendorId, is_available: true } });
    const lockedPrices = items.map((item) => ({
      item_id: item.id,
      name: item.name,
      locked_price: Number(item.discounted_price || item.price),
    }));

    const lock = this.lockRepo.create({
      user_id: userId,
      vendor_id: vendorId,
      locked_prices: lockedPrices,
      expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    });

    return this.lockRepo.save(lock);
  }

  async getActiveLock(userId: string, vendorId: string) {
    return this.lockRepo.findOne({
      where: { user_id: userId, vendor_id: vendorId, is_used: false, expires_at: MoreThan(new Date()) },
    });
  }

  async useLock(lockId: string) {
    const lock = await this.lockRepo.findOne({ where: { id: lockId } });
    if (!lock) throw new NotFoundException('Price lock not found');
    if (lock.is_used) throw new BadRequestException('Price lock already used');
    if (new Date() > lock.expires_at) throw new BadRequestException('Price lock expired');

    lock.is_used = true;
    return this.lockRepo.save(lock);
  }
}
