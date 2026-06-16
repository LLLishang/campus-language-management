import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';

@Entity('leave_requests')
export class LeaveRequest {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  student_id: number;

  @Column({ type: 'enum', enum: ['SICK', 'PERSONAL', 'OTHER'] })
  leave_type: string;

  @Column({ type: 'tinyint', unsigned: true })
  start_period: number;

  @Column({ type: 'tinyint', unsigned: true })
  end_period: number;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'json', nullable: true })
  attachment_urls: string[];

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'], default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
