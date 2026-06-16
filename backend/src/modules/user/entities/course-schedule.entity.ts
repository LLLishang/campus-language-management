import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('course_schedule')
export class CourseSchedule {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'tinyint', unsigned: true, unique: true })
  period_no: number;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({ type: 'smallint', unsigned: true, default: 10 })
  break_duration: number;

  @Column({ type: 'enum', enum: ['A', 'B', 'C', 'D', 'E'] })
  block: string;

  @Column({ type: 'tinyint', default: 1 })
  is_active: boolean;
}
