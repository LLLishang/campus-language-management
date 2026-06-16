import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('repair_orders')
export class RepairOrder {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  reporter_id: number;

  @Column({ type: 'varchar', length: 64 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 128 })
  location: string;

  @Column({ type: 'enum', enum: ['ELECTRICAL', 'PLUMBING', 'FURNITURE', 'IT', 'BUILDING', 'OTHER'] })
  category: string;

  @Column({ type: 'enum', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' })
  urgency: string;

  @Column({ type: 'json', nullable: true })
  image_urls: string[];

  @Column({ type: 'enum', enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'PENDING' })
  status: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  assigned_to: number;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
