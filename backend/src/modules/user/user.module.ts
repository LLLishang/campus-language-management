import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { CourseSchedule } from './entities/course-schedule.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, Teacher, CourseSchedule])],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
