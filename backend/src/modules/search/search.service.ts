import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../vendors/entities/vendor.entity';
import { VendorItem } from '../vendors/entities/vendor-item.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
    @InjectRepository(VendorItem) private itemRepo: Repository<VendorItem>,
  ) {}

  async search(query: string, categoryId?: string, lat?: number, lng?: number) {
    const vendorQb = this.vendorRepo.createQueryBuilder('v')
      .leftJoinAndSelect('v.category', 'c')
      .where('v.is_active = true AND v.is_verified = true')
      .andWhere('(LOWER(v.name) LIKE :q OR LOWER(v.description) LIKE :q)', { q: `%${query.toLowerCase()}%` });

    if (categoryId) {
      vendorQb.andWhere('v.category_id = :cid', { cid: categoryId });
    }

    const vendors = await vendorQb.limit(20).getMany();

    const items = await this.itemRepo.createQueryBuilder('i')
      .leftJoinAndSelect('i.vendor', 'v')
      .where('i.is_available = true')
      .andWhere('(LOWER(i.name) LIKE :q OR LOWER(i.description) LIKE :q)', { q: `%${query.toLowerCase()}%` })
      .limit(20)
      .getMany();

    return { vendors, items };
  }
}
