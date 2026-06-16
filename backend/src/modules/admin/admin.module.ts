import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { User } from '../user/entities/user.entity';
import { Student } from '../user/entities/student.entity';
import { Teacher } from '../user/entities/teacher.entity';
import { Venue } from '../venue/entities/venue.entity';
import { VenueBooking } from '../venue/entities/venue-booking.entity';
import { LeaveRequest } from '../leave/entities/leave-request.entity';
import { RepairOrder } from '../repair/entities/repair-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Teacher, Venue, VenueBooking, LeaveRequest, RepairOrder]),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'campus-management-jwt-secret-2026', signOptions: { expiresIn: '2h' } }),
  ],
  controllers: [AdminController],
})
export class AdminModule {}
