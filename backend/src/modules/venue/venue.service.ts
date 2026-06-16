import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { VenueBooking } from './entities/venue-booking.entity';
import { CourseSchedule } from '../user/entities/course-schedule.entity';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue) private venueRepo: Repository<Venue>,
    @InjectRepository(VenueBooking) private bookingRepo: Repository<VenueBooking>,
    @InjectRepository(CourseSchedule) private scheduleRepo: Repository<CourseSchedule>,
  ) {}

  async findAll(category?: string, keyword?: string) {
    const where: any = { is_active: true };
    if (category) where.category = category;
    const qb = this.venueRepo.createQueryBuilder('v').where('v.is_active = 1');
    if (category) qb.andWhere('v.category = :category', { category });
    if (keyword) qb.andWhere('(v.name LIKE :kw OR v.location LIKE :kw)', { kw: `%${keyword}%` });
    return qb.orderBy('v.created_at', 'DESC').getMany();
  }

  async findOne(id: number) {
    const venue = await this.venueRepo.findOne({ where: { id } });
    if (!venue) throw new NotFoundException('场地不存在');
    return venue;
  }

  async getAvailability(venueId: number, date: string) {
    const venue = await this.findOne(venueId);
    const bookings = await this.bookingRepo.find({
      where: { venue_id: venueId, booking_date: date, status: Not(In(['REJECTED', 'CANCELLED'])) },
    });
    const schedule = await this.scheduleRepo.find({ order: { period_no: 'ASC' } });

    // 构建每个节次的占用情况
    const occupiedPeriods = new Set<number>();
    bookings.forEach((b) => {
      for (let i = b.start_period; i <= b.end_period; i++) occupiedPeriods.add(i);
    });

    return {
      venueId,
      date,
      periods: schedule.map((s) => ({
        period: s.period_no,
        startTime: s.start_time,
        endTime: s.end_time,
        available: !occupiedPeriods.has(s.period_no) && venue.open_periods.includes(s.period_no),
      })),
    };
  }

  async book(userId: number, dto: { venueId: number; bookingDate: string; startPeriod: number; endPeriod: number; purpose: string; attendeeCount?: number }) {
    // 检查冲突
    const conflicting = await this.bookingRepo.find({
      where: {
        venue_id: dto.venueId,
        booking_date: dto.bookingDate,
        status: Not(In(['REJECTED', 'CANCELLED'])),
      },
    });

    for (const b of conflicting) {
      if (dto.startPeriod <= b.end_period && dto.endPeriod >= b.start_period) {
        throw new ConflictException('该时间段已被预约，请重新选择');
      }
    }

    const booking = this.bookingRepo.create({
      venue_id: dto.venueId,
      user_id: userId,
      booking_date: dto.bookingDate,
      start_period: dto.startPeriod,
      end_period: dto.endPeriod,
      purpose: dto.purpose,
      attendee_count: dto.attendeeCount || 0,
      status: 'PENDING',
    });
    return this.bookingRepo.save(booking);
  }

  async getAllBookings() {
    const bookings = await this.bookingRepo.find({ order: { created_at: 'DESC' } });
    const results: any[] = [];
    for (const b of bookings) {
      const venue = await this.venueRepo.findOne({ where: { id: b.venue_id } });
      results.push({ ...b, venue });
    }
    return results;
  }

  async getMyBookings(userId: number) {
    const bookings = await this.bookingRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    const results: any[] = [];
    for (const b of bookings) {
      const venue = await this.venueRepo.findOne({ where: { id: b.venue_id } });
      results.push({ ...b, venue });
    }
    return results;
  }

  async getBookingById(id: number) {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('预约记录不存在');
    const venue = await this.venueRepo.findOne({ where: { id: booking.venue_id } });
    return { ...booking, venue };
  }

  async cancelBooking(id: number, userId: number) {
    const booking = await this.bookingRepo.findOne({ where: { id, user_id: userId } });
    if (!booking) throw new NotFoundException('预约记录不存在');
    booking.status = 'CANCELLED';
    return this.bookingRepo.save(booking);
  }

  // 管理员方法
  async adminFindAll() {
    return this.venueRepo.find({ order: { created_at: 'DESC' } });
  }

  async adminCreate(data: Partial<Venue>) {
    const venue = this.venueRepo.create(data);
    return this.venueRepo.save(venue);
  }

  async adminUpdate(id: number, data: Partial<Venue>) {
    await this.findOne(id);
    await this.venueRepo.update(id, data);
    return this.findOne(id);
  }

  async adminDelete(id: number) {
    await this.findOne(id);
    await this.venueRepo.softDelete(id);
    return { message: '已删除' };
  }
}
