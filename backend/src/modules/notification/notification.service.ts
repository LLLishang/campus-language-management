import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,
  ) {}

  /** 创建一条通知 */
  async create(dto: {
    recipientId: number;
    type: NotificationType;
    title: string;
    content: string;
    refType?: string;
    refId?: number;
  }) {
    const notif = new Notification();
    notif.recipient_id = dto.recipientId;
    notif.type = dto.type;
    notif.title = dto.title;
    notif.content = dto.content;
    notif.ref_type = dto.refType || null;
    notif.ref_id = dto.refId || null;
    return this.notifRepo.save(notif);
  }

  /** 获取我的通知列表 */
  async findMine(userId: number, isRead?: boolean) {
    const where: any = { recipient_id: userId };
    if (isRead !== undefined) where.is_read = isRead ? 1 : 0;
    const list = await this.notifRepo.find({
      where,
      order: { created_at: 'DESC' },
      take: 100,
    });
    return list.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      content: n.content,
      refType: n.ref_type,
      refId: n.ref_id,
      isRead: n.is_read === 1,
      createdAt: n.created_at,
    }));
  }

  /** 未读数量 */
  async unreadCount(userId: number) {
    return this.notifRepo.count({
      where: { recipient_id: userId, is_read: 0 },
    });
  }

  /** 标记单条已读 */
  async markRead(id: number, userId: number) {
    const notif = await this.notifRepo.findOne({ where: { id, recipient_id: userId } });
    if (!notif) throw new NotFoundException('通知不存在');
    notif.is_read = 1;
    return this.notifRepo.save(notif);
  }

  /** 全部已读 */
  async markAllRead(userId: number) {
    await this.notifRepo.update(
      { recipient_id: userId, is_read: 0 },
      { is_read: 1 },
    );
    return { message: '已全部标记为已读' };
  }

  /** 批量创建通知 */
  async batchCreate(notifications: Array<{
    recipientId: number;
    type: NotificationType;
    title: string;
    content: string;
    refType?: string;
    refId?: number;
  }>) {
    const entities = notifications.map((dto) => {
      const n = new Notification();
      n.recipient_id = dto.recipientId;
      n.type = dto.type;
      n.title = dto.title;
      n.content = dto.content;
      n.ref_type = dto.refType || null;
      n.ref_id = dto.refId || null;
      return n;
    });
    return this.notifRepo.save(entities);
  }
}
