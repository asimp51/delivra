import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { OrderTimerService } from './order-timer.service';
import { GroupOrderService } from './group-order.service';
import { GroupOrderController } from './group-order.controller';
import { MysteryDealService } from './mystery-deal.service';
import { MysteryDealController } from './mystery-deal.controller';
import { PriceLockService } from './price-lock.service';
import { PriceLockController } from './price-lock.controller';
import { ChatGateway } from './chat.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { Review } from './entities/review.entity';
import { GroupOrder, GroupOrderMember } from './entities/group-order.entity';
import { MysteryDeal } from './entities/mystery-deal.entity';
import { PriceLock } from './entities/price-lock.entity';
import { VendorItem } from '../vendors/entities/vendor-item.entity';
import { DeliveryAssignment } from '../delivery/entities/delivery-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Order, OrderItem, OrderStatusHistory, Review, VendorItem, DeliveryAssignment,
    GroupOrder, GroupOrderMember, MysteryDeal, PriceLock,
  ])],
  controllers: [OrdersController, GroupOrderController, MysteryDealController, PriceLockController],
  providers: [OrdersService, OrdersGateway, OrderTimerService, GroupOrderService, MysteryDealService, PriceLockService, ChatGateway],
  exports: [OrdersService, OrdersGateway],
})
export class OrdersModule {}
