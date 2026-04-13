import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@ApiTags('Delivery')
@Controller('rider')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RIDER)
@ApiBearerAuth()
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return this.deliveryService.getRiderByUserId(user.id);
  }

  @Post('register')
  register(@CurrentUser() user: User, @Body() data: any) {
    return this.deliveryService.registerRider(user.id, data);
  }

  @Get('available-orders')
  getAvailableOrders(@CurrentUser() user: User) {
    return this.deliveryService.getAvailableOrders(user.id);
  }

  @Post('orders/:id/accept')
  acceptOrder(@Param('id') orderId: string, @CurrentUser() user: User) {
    return this.deliveryService.acceptDelivery(user.id, orderId);
  }

  @Patch('orders/:id/picked-up')
  markPickedUp(@Param('id') orderId: string, @CurrentUser() user: User) {
    return { message: 'Picked up', orderId };
  }

  @Patch('orders/:id/delivered')
  markDelivered(@Param('id') orderId: string, @CurrentUser() user: User) {
    return this.deliveryService.completeDelivery(user.id, orderId);
  }

  @Post('location')
  updateLocation(@CurrentUser() user: User, @Body() dto: UpdateLocationDto) {
    return this.deliveryService.updateLocation(user.id, dto.latitude, dto.longitude, dto.order_id);
  }

  @Get('earnings')
  getEarnings(@CurrentUser() user: User) {
    return this.deliveryService.getEarnings(user.id);
  }

  @Patch('online-status')
  toggleOnline(@CurrentUser() user: User, @Body('is_online') isOnline: boolean) {
    return this.deliveryService.toggleOnline(user.id, isOnline);
  }
}
