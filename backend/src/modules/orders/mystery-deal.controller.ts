import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MysteryDealService } from './mystery-deal.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@ApiTags('Mystery Deals')
@Controller('mystery-deals')
export class MysteryDealController {
  constructor(private dealService: MysteryDealService) {}

  @Get()
  getActive() {
    return this.dealService.getActiveDeals();
  }

  @Get('vendor/:vendorId')
  getByVendor(@Param('vendorId') vendorId: string) {
    return this.dealService.getDealsByVendor(vendorId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  create(@Body() data: any) {
    return this.dealService.createDeal(data.vendor_id, data);
  }

  @Post(':id/purchase')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  purchase(@Param('id') id: string) {
    return this.dealService.purchaseDeal(id);
  }
}
