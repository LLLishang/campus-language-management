import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { LeaveRequest } from './entities/leave-request.entity';
import { LeaveApproval } from './entities/leave-approval.entity';
import { CourseSchedule } from '../user/entities/course-schedule.entity';
import { Student } from '../user/entities/student.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest, LeaveApproval, CourseSchedule, Student, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'campus-management-jwt-secret-2026',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [LeaveController],
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {}
