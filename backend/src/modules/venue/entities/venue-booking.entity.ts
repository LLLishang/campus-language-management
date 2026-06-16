import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('venue_bookings')
export class VenueBooking {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  venue_id: number;

  @Column({ type: 'bigint', unsigned: true })
  user_id: number;

  @Column({ type: 'date' })
  booking_date: string;

  @Column({ type: 'tinyint', unsigned: true })
  start_period: number;

  @Column({ type: 'tinyint', unsigned: true })
  end_period: number;

  @Column({ type: 'varchar', length: 256 })
  purpose: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  attendee_count: number;

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'CHECKED_IN'], default: 'PENDING' })
  status: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  approver_id: number;

  @Column({ type: 'datetime', nullable: true })
  approved_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
