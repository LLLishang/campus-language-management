import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('leave_approvals')
export class LeaveApproval {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  leave_request_id: number;

  @Column({ type: 'bigint', unsigned: true })
  approver_id: number;

  @Column({ type: 'enum', enum: ['APPROVE', 'REJECT'] })
  action: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;
}
