import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';
import { Venue } from './entities/venue.entity';
import { VenueBooking } from './entities/venue-booking.entity';
import { CourseSchedule } from '../user/entities/course-schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venue, VenueBooking, CourseSchedule]),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'campus-management-jwt-secret-2026', signOptions: { expiresIn: '2h' } }),
  ],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}
