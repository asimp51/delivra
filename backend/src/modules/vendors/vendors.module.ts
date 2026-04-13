import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';
import { VendorItem } from './entities/vendor-item.entity';
import { VendorSchedule } from './entities/vendor-schedule.entity';
import { ItemOptionGroup } from './entities/item-option-group.entity';
import { ItemOption } from './entities/item-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, VendorItem, VendorSchedule, ItemOptionGroup, ItemOption])],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
