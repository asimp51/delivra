import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { CreateVendorItemDto } from './dto/create-vendor-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@ApiTags('Vendors')
@Controller()
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  @Get('vendors')
  findNearby(
    @Query('category') category?: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
  ) {
    return this.vendorsService.findNearby(category, lat, lng);
  }

  @Get('vendors/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.vendorsService.findBySlug(slug);
  }

  @Get('vendor/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  getMyVendor(@CurrentUser() user: User) {
    return this.vendorsService.getVendorByOwner(user.id);
  }

  @Post('vendor/register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  createVendor(@CurrentUser() user: User, @Body() dto: CreateVendorDto) {
    return this.vendorsService.create(user.id, dto);
  }

  @Patch('vendor/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  updateMyVendor(@CurrentUser() user: User, @Body() data: any) {
    return this.vendorsService.updateVendor(data.id, data);
  }

  @Post('vendor/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  addItem(@Body() dto: CreateVendorItemDto & { vendor_id: string }) {
    return this.vendorsService.addItem(dto.vendor_id, dto);
  }

  @Patch('vendor/items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  updateItem(@Param('id') id: string, @Body() data: any) {
    return this.vendorsService.updateItem(id, data);
  }

  @Delete('vendor/items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR_OWNER)
  @ApiBearerAuth()
  removeItem(@Param('id') id: string) {
    return this.vendorsService.removeItem(id);
  }
}
