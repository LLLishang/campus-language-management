import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum NotificationType {
  LEAVE_UPDATE = 'LEAVE_UPDATE',
  BOOKING_UPDATE = 'BOOKING_UPDATE',
  REPAIR_UPDATE = 'REPAIR_UPDATE',
  SYSTEM = 'SYSTEM',
  AI_REMINDER = 'AI_REMINDER',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  recipient_id: number;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'varchar', length: 128 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  ref_type: string | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  ref_id: number | null;

  @Column({ type: 'tinyint', default: 0 })
  is_read: number;

  @CreateDateColumn()
  created_at: Date;
}
