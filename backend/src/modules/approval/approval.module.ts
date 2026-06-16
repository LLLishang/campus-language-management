import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ApprovalController } from './approval.controller';
import { ApprovalService } from './approval.service';
import { LeaveRequest } from '../leave/entities/leave-request.entity';
import { LeaveApproval } from '../leave/entities/leave-approval.entity';
import { Student } from '../user/entities/student.entity';
import { Teacher } from '../user/entities/teacher.entity';
import { User } from '../user/entities/user.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest, LeaveApproval, Student, Teacher, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'campus-management-jwt-secret-2026',
      signOptions: { expiresIn: '2h' },
    }),
    NotificationModule,
  ],
  controllers: [ApprovalController],
  providers: [ApprovalService],
})
export class ApprovalModule {}
