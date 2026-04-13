import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';

@ApiTags('Payments')
@Controller()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('payments/validate-promo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  validatePromo(@Body() data: { code: string; order_amount: number }) {
    return this.paymentsService.validatePromoCode(data.code, data.order_amount);
  }

  @Get('admin/payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  getAllPayments(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.paymentsService.getAllPayments(page, limit);
  }

  @Get('admin/promotions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  getAllPromotions() {
    return this.paymentsService.getAllPromotions();
  }

  @Post('admin/promotions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  createPromotion(@Body() data: any) {
    return this.paymentsService.createPromotion(data);
  }

  @Patch('admin/promotions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  updatePromotion(@Param('id') id: string, @Body() data: any) {
    return this.paymentsService.updatePromotion(id, data);
  }

  @Delete('admin/promotions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  deletePromotion(@Param('id') id: string) {
    return this.paymentsService.deletePromotion(id);
  }
}
