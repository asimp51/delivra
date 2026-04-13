import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
  ) {}

  async create(userId: string, title: string, body: string, type = 'system', data: any = {}) {
    const notif = this.notifRepo.create({ user_id: userId, title, body, type, data });
    return this.notifRepo.save(notif);
  }

  async getUserNotifications(userId: string) {
    return this.notifRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: 50,
    });
  }

  async markAsRead(id: string) {
    await this.notifRepo.update(id, { is_read: true });
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await this.notifRepo.update({ user_id: userId, is_read: false }, { is_read: true });
    return { success: true };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notifRepo.count({ where: { user_id: userId, is_read: false } });
    return { count };
  }
}
