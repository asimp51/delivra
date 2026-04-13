import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PriceLockService } from './price-lock.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@ApiTags('Price Lock')
@Controller('price-lock')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PriceLockController {
  constructor(private lockService: PriceLockService) {}

  @Post('vendor/:vendorId')
  lockPrices(@Param('vendorId') vendorId: string, @CurrentUser() user: User) {
    return this.lockService.lockPrices(user.id, vendorId);
  }

  @Get('vendor/:vendorId')
  getActiveLock(@Param('vendorId') vendorId: string, @CurrentUser() user: User) {
    return this.lockService.getActiveLock(user.id, vendorId);
  }

  @Post(':id/use')
  useLock(@Param('id') id: string) {
    return this.lockService.useLock(id);
  }
}
