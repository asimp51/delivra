import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { OrderStatus } from './entities/order.entity';

@ApiTags('Orders')
@Controller()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMyOrders(@CurrentUser() user: User) {
    return this.ordersService.getCustomerOrders(user.id);
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getOrder(@Param('id') id: string) {
    return this.ordersService.getById(id);
  }

  @Patch('orders/:id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  cancel(@Param('id') id: string, @CurrentUser() user: User, @Body('reason') reason?: string) {
    return this.ordersService.cancelOrder(id, user.id, reason);
  }

  @Post('orders/:id/rate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  rate(@Param('id') id: string, @CurrentUser() user: User, @Body() data: any) {
    return this.ordersService.rateOrder(id, user.id, data);
  }

  @Get('vendor/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  getVendorOrders(@Query('vendor_id') vendorId: string, @Query('status') status?: OrderStatus) {
    return this.ordersService.getVendorOrders(vendorId, status);
  }

  @Patch('vendor/orders/:id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  acceptOrder(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.updateStatus(id, OrderStatus.CONFIRMED, user.id, 'Vendor accepted');
  }

  @Patch('vendor/orders/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  rejectOrder(@Param('id') id: string, @CurrentUser() user: User, @Body('reason') reason?: string) {
    return this.ordersService.cancelOrder(id, user.id, reason);
  }

  @Patch('vendor/orders/:id/preparing')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  markPreparing(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.updateStatus(id, OrderStatus.PREPARING, user.id);
  }

  @Patch('vendor/orders/:id/ready')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  markReady(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.updateStatus(id, OrderStatus.READY_FOR_PICKUP, user.id);
  }

  @Get('admin/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  getAllOrders(@Query('status') status?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.ordersService.getAllOrders({ status, page, limit });
  }
}
