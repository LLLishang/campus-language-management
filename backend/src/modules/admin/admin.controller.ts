import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Role } from '../../common/decorators/roles.decorator';
import { User } from '../user/entities/user.entity';
import { Student } from '../user/entities/student.entity';
import { Teacher } from '../user/entities/teacher.entity';
import { Venue } from '../venue/entities/venue.entity';
import { VenueBooking } from '../venue/entities/venue-booking.entity';
import { LeaveRequest } from '../leave/entities/leave-request.entity';
import { RepairOrder } from '../repair/entities/repair-order.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @InjectRepository(Venue) private venueRepo: Repository<Venue>,
    @InjectRepository(VenueBooking) private bookingRepo: Repository<VenueBooking>,
    @InjectRepository(LeaveRequest) private leaveRepo: Repository<LeaveRequest>,
    @InjectRepository(RepairOrder) private repairRepo: Repository<RepairOrder>,
  ) {}

  // ========== 用户管理 ==========
  @Get('users')
  async getUsers() {
    const users = await this.userRepo.find({ order: { created_at: 'DESC' } });
    return users.map((u) => {
      const { password_hash, ...rest } = u as any;
      return { ...rest, password: undefined };
    });
  }

  @Post('users')
  async createUser(@Body() dto: any) {
    const user = this.userRepo.create({
      username: dto.username,
      password_hash: await bcrypt.hash(dto.password || '123456', 10),
      role: dto.role,
      real_name: dto.real_name,
      phone: dto.phone,
      email: dto.email,
    });
    const saved = await this.userRepo.save(user);

    if (dto.role === 'STUDENT') {
      const student = this.studentRepo.create({
        user_id: saved.id,
        student_no: dto.student_no || `S${Date.now()}`,
        class_name: dto.class_name || '未分配',
        grade: dto.grade || '2021级',
        department: dto.department || '未分配',
      });
      await this.studentRepo.save(student);
    } else if (dto.role === 'TEACHER') {
      const teacher = this.teacherRepo.create({
        user_id: saved.id,
        teacher_no: dto.teacher_no || `T${Date.now()}`,
        title: dto.title,
        department: dto.department || '未分配',
        managed_classes: dto.managed_classes || [],
      });
      await this.teacherRepo.save(teacher);
    }
    return saved;
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: number, @Body() dto: any) {
    if (dto.real_name) await this.userRepo.update(id, { real_name: dto.real_name });
    if (dto.phone) await this.userRepo.update(id, { phone: dto.phone });
    if (dto.email) await this.userRepo.update(id, { email: dto.email });
    if (dto.role) await this.userRepo.update(id, { role: dto.role });
    if (dto.password) {
      await this.userRepo.update(id, { password_hash: await bcrypt.hash(dto.password, 10) });
    }
    return this.userRepo.findOne({ where: { id } });
  }

  // ========== 场地管理 ==========
  @Get('venues')
  async getVenues() {
    return this.venueRepo.find({ order: { created_at: 'DESC' } });
  }

  @Post('venues')
  async createVenue(@Body() dto: any) {
    const venue = this.venueRepo.create(dto);
    return this.venueRepo.save(venue);
  }

  @Put('venues/:id')
  async updateVenue(@Param('id') id: number, @Body() dto: any) {
    await this.venueRepo.update(id, dto);
    return this.venueRepo.findOne({ where: { id } });
  }

  @Delete('venues/:id')
  async deleteVenue(@Param('id') id: number) {
    await this.venueRepo.softDelete(id);
    return { message: '已删除' };
  }

  // ========== 报修管理 ==========
  @Get('repair')
  async getRepairs() {
    return this.repairRepo.find({ order: { created_at: 'DESC' } });
  }
}
