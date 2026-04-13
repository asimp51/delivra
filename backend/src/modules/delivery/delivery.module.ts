import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { DeliveryGateway } from './delivery.gateway';
import { DeliveryZonesService } from './delivery-zones.service';
import { CarbonFootprintService } from './carbon-footprint.service';
import { Rider } from './entities/rider.entity';
import { DeliveryAssignment } from './entities/delivery-assignment.entity';
import { RiderLocation } from './entities/rider-location.entity';
import { CarbonFootprint } from './entities/carbon-footprint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rider, DeliveryAssignment, RiderLocation, CarbonFootprint])],
  controllers: [DeliveryController],
  providers: [DeliveryService, DeliveryGateway, DeliveryZonesService, CarbonFootprintService],
  exports: [DeliveryService, DeliveryGateway, DeliveryZonesService, CarbonFootprintService],
})
export class DeliveryModule {}
