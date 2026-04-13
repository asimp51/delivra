import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupOrder, GroupOrderMember, GroupOrderStatus, SplitMethod } from './entities/group-order.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GroupOrderService {
  constructor(
    @InjectRepository(GroupOrder) private groupRepo: Repository<GroupOrder>,
    @InjectRepository(GroupOrderMember) private memberRepo: Repository<GroupOrderMember>,
  ) {}

  async createGroupOrder(hostId: string, vendorId: string, splitMethod: SplitMethod = SplitMethod.PER_PERSON) {
    const shareCode = uuid().substring(0, 8).toUpperCase();
    const group = this.groupRepo.create({
      share_code: shareCode,
      host_id: hostId,
      vendor_id: vendorId,
      split_method: splitMethod,
      deadline: new Date(Date.now() + 30 * 60 * 1000), // 30 min to collect
    });
    const saved = await this.groupRepo.save(group);

    // Auto-add host as member
    await this.memberRepo.save(this.memberRepo.create({
      group_order_id: saved.id,
      user_id: hostId,
      items: [],
    }));

    return { ...saved, share_link: `delivra://group/${shareCode}` };
  }

  async joinGroupOrder(shareCode: string, userId: string) {
    const group = await this.groupRepo.findOne({ where: { share_code: shareCode }, relations: ['vendor'] });
    if (!group) throw new NotFoundException('Group order not found');
    if (group.status !== GroupOrderStatus.COLLECTING) throw new BadRequestException('Group order is no longer accepting members');

    const existing = await this.memberRepo.findOne({ where: { group_order_id: group.id, user_id: userId } });
    if (existing) return { group, member: existing, message: 'Already a member' };

    const memberCount = await this.memberRepo.count({ where: { group_order_id: group.id } });
    if (memberCount >= group.max_members) throw new BadRequestException('Group is full');

    const member = await this.memberRepo.save(this.memberRepo.create({
      group_order_id: group.id,
      user_id: userId,
      items: [],
    }));

    return { group, member };
  }

  async addItemsToGroup(groupOrderId: string, userId: string, items: any[]) {
    const member = await this.memberRepo.findOne({ where: { group_order_id: groupOrderId, user_id: userId } });
    if (!member) throw new NotFoundException('You are not a member of this group');

    member.items = items;
    member.subtotal = items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
    return this.memberRepo.save(member);
  }

  async getGroupOrder(shareCode: string) {
    const group = await this.groupRepo.findOne({
      where: { share_code: shareCode },
      relations: ['vendor'],
    });
    if (!group) throw new NotFoundException('Group order not found');

    const members = await this.memberRepo.find({
      where: { group_order_id: group.id },
      relations: ['user'],
    });

    return { ...group, members };
  }

  async lockGroupOrder(groupOrderId: string, hostId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupOrderId, host_id: hostId } });
    if (!group) throw new NotFoundException('Group order not found');
    group.status = GroupOrderStatus.LOCKED;
    return this.groupRepo.save(group);
  }
}
