import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('repair_logs')
export class RepairLog {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  repair_order_id: number;

  @Column({ type: 'bigint', unsigned: true })
  operator_id: number;

  @Column({ type: 'enum', enum: ['ASSIGN', 'START', 'UPDATE', 'COMPLETE', 'CANCEL'] })
  action: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;
}
