import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  async getStudentByUserId(userId: number): Promise<Student | null> {
    return this.studentRepo.findOne({ where: { user_id: userId } });
  }

  async getTeacherByUserId(userId: number): Promise<Teacher | null> {
    return this.teacherRepo.findOne({ where: { user_id: userId } });
  }
}
