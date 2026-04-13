import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { MysteryDeal } from './entities/mystery-deal.entity';

@Injectable()
export class MysteryDealService {
  constructor(
    @InjectRepository(MysteryDeal) private dealRepo: Repository<MysteryDeal>,
  ) {}

  async getActiveDeals() {
    const now = new Date();
    return this.dealRepo.find({
      where: {
        is_active: true,
        available_from: LessThan(now),
        available_until: MoreThan(now),
      },
      relations: ['vendor'],
      order: { mystery_price: 'ASC' },
    });
  }

  async getDealsByVendor(vendorId: string) {
    return this.dealRepo.find({
      where: { vendor_id: vendorId, is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async createDeal(vendorId: string, data: Partial<MysteryDeal>) {
    const deal = this.dealRepo.create({ ...data, vendor_id: vendorId });
    return this.dealRepo.save(deal);
  }

  async purchaseDeal(dealId: string) {
    const deal = await this.dealRepo.findOne({ where: { id: dealId } });
    if (!deal) throw new NotFoundException('Deal not found');
    if (deal.quantity_sold >= deal.quantity_available) throw new BadRequestException('Deal sold out');
    if (new Date() > deal.available_until) throw new BadRequestException('Deal expired');

    deal.quantity_sold += 1;
    await this.dealRepo.save(deal);

    // Return the actual items (revealed after purchase)
    return { deal, revealed_items: deal.actual_items };
  }
}
