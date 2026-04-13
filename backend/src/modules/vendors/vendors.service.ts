import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { VendorItem } from './entities/vendor-item.entity';
import { ItemOptionGroup } from './entities/item-option-group.entity';
import { ItemOption } from './entities/item-option.entity';
import { VendorSchedule } from './entities/vendor-schedule.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { CreateVendorItemDto } from './dto/create-vendor-item.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
    @InjectRepository(VendorItem) private itemRepo: Repository<VendorItem>,
    @InjectRepository(ItemOptionGroup) private optionGroupRepo: Repository<ItemOptionGroup>,
    @InjectRepository(ItemOption) private optionRepo: Repository<ItemOption>,
    @InjectRepository(VendorSchedule) private scheduleRepo: Repository<VendorSchedule>,
  ) {}

  async findNearby(categorySlug?: string, lat?: number, lng?: number) {
    const qb = this.vendorRepo.createQueryBuilder('v')
      .leftJoinAndSelect('v.category', 'c')
      .where('v.is_active = :active', { active: true })
      .andWhere('v.is_verified = :verified', { verified: true });

    if (categorySlug) {
      qb.andWhere('c.slug = :slug', { slug: categorySlug });
    }

    if (lat && lng) {
      qb.addSelect(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(v.latitude)) * cos(radians(v.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(v.latitude))))`,
        'distance',
      )
      .setParameter('lat', lat)
      .setParameter('lng', lng)
      .orderBy('distance', 'ASC');
    }

    return qb.limit(50).getMany();
  }

  async findBySlug(slug: string) {
    const vendor = await this.vendorRepo.findOne({
      where: { slug },
      relations: ['category', 'items', 'items.option_groups', 'items.option_groups.options', 'items.subcategory', 'schedules'],
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async create(ownerId: string, dto: CreateVendorDto) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const vendor = this.vendorRepo.create({ ...dto, owner_id: ownerId, slug });
    return this.vendorRepo.save(vendor);
  }

  async updateVendor(vendorId: string, data: Partial<Vendor>) {
    await this.vendorRepo.update(vendorId, data);
    return this.vendorRepo.findOne({ where: { id: vendorId }, relations: ['category'] });
  }

  async getVendorByOwner(ownerId: string) {
    return this.vendorRepo.findOne({
      where: { owner_id: ownerId },
      relations: ['category', 'items', 'items.option_groups', 'items.option_groups.options', 'schedules'],
    });
  }

  async addItem(vendorId: string, dto: CreateVendorItemDto) {
    const { option_groups, ...itemData } = dto;
    const item = this.itemRepo.create({ ...itemData, vendor_id: vendorId });
    const savedItem = await this.itemRepo.save(item);

    if (option_groups?.length) {
      for (const group of option_groups) {
        const { options, ...groupData } = group;
        const savedGroup = await this.optionGroupRepo.save(
          this.optionGroupRepo.create({ ...groupData, vendor_item_id: savedItem.id }),
        );
        if (options?.length) {
          const optionEntities = options.map((o) =>
            this.optionRepo.create({ ...o, group_id: savedGroup.id }),
          );
          await this.optionRepo.save(optionEntities);
        }
      }
    }

    return this.itemRepo.findOne({
      where: { id: savedItem.id },
      relations: ['option_groups', 'option_groups.options'],
    });
  }

  async updateItem(itemId: string, data: Partial<VendorItem>) {
    await this.itemRepo.update(itemId, data);
    return this.itemRepo.findOne({ where: { id: itemId }, relations: ['option_groups', 'option_groups.options'] });
  }

  async removeItem(itemId: string) {
    await this.itemRepo.delete(itemId);
    return { deleted: true };
  }

  async getVendorOrders(vendorId: string) {
    return this.vendorRepo.findOne({ where: { id: vendorId } });
  }
}
