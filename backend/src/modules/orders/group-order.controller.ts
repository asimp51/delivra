import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GroupOrderService } from './group-order.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { SplitMethod } from './entities/group-order.entity';

@ApiTags('Group Orders')
@Controller('group-orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GroupOrderController {
  constructor(private groupService: GroupOrderService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() data: { vendor_id: string; split_method?: SplitMethod }) {
    return this.groupService.createGroupOrder(user.id, data.vendor_id, data.split_method);
  }

  @Post('join/:shareCode')
  join(@Param('shareCode') shareCode: string, @CurrentUser() user: User) {
    return this.groupService.joinGroupOrder(shareCode, user.id);
  }

  @Get(':shareCode')
  getGroup(@Param('shareCode') shareCode: string) {
    return this.groupService.getGroupOrder(shareCode);
  }

  @Patch(':id/items')
  addItems(@Param('id') id: string, @CurrentUser() user: User, @Body('items') items: any[]) {
    return this.groupService.addItemsToGroup(id, user.id, items);
  }

  @Patch(':id/lock')
  lock(@Param('id') id: string, @CurrentUser() user: User) {
    return this.groupService.lockGroupOrder(id, user.id);
  }
}
