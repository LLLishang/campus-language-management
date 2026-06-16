import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'enum', enum: ['SPORTS', 'CLASSROOM', 'MEETING', 'LAB', 'OTHER'] })
  category: string;

  @Column({ type: 'varchar', length: 128 })
  location: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  capacity: number;

  @Column({ type: 'json', nullable: true })
  facilities: string[];

  @Column({ type: 'json', nullable: true })
  image_urls: string[];

  @Column({ type: 'tinyint', default: 1 })
  is_active: boolean;

  @Column({ type: 'json' })
  open_periods: number[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
