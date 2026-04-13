import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Vendor } from '../vendors/entities/vendor.entity';
import { VendorItem } from '../vendors/entities/vendor-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, VendorItem])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
