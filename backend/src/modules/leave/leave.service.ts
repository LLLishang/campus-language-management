import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { LeaveApproval } from './entities/leave-approval.entity';
import { CourseSchedule } from '../user/entities/course-schedule.entity';
import { Student } from '../user/entities/student.entity';
import { User } from '../user/entities/user.entity';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(LeaveRequest) private leaveRepo: Repository<LeaveRequest>,
    @InjectRepository(LeaveApproval) private approvalRepo: Repository<LeaveApproval>,
    @InjectRepository(CourseSchedule) private scheduleRepo: Repository<CourseSchedule>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getSchedule() {
    return this.scheduleRepo.find({ order: { period_no: 'ASC' } });
  }

  async create(userId: number, dto: CreateLeaveDto) {
    const student = await this.studentRepo.findOne({ where: { user_id: userId } });
    if (!student) throw new NotFoundException('学生信息不存在');

    const leave = this.leaveRepo.create({
      student_id: student.id,
      leave_type: dto.leaveType,
      start_date: dto.startDate,
      end_date: dto.endDate,
      start_period: dto.startPeriod,
      end_period: dto.endPeriod,
      reason: dto.reason,
      attachment_urls: dto.attachmentUrls || [],
      status: 'PENDING',
    });
    return this.leaveRepo.save(leave);
  }

  async findMine(userId: number) {
    const student = await this.studentRepo.findOne({ where: { user_id: userId } });
    if (!student) return [];
    return this.leaveRepo.find({
      where: { student_id: student.id },
      order: { created_at: 'DESC' },
    });
  }

  async findAll() {
    const leaves = await this.leaveRepo.find({ order: { created_at: 'DESC' } });
    const results: any[] = [];
    for (const l of leaves) {
      const student = await this.studentRepo.findOne({ where: { id: l.student_id } });
      const user = student ? await this.userRepo.findOne({ where: { id: student.user_id } }) : null;
      results.push({ ...l, student_name: user?.real_name, class_name: student?.class_name });
    }
    return results;
  }

  async findOne(id: number) {
    const leave = await this.leaveRepo.findOne({ where: { id } });
    if (!leave) throw new NotFoundException('请假记录不存在');
    return leave;
  }

  async update(id: number, userId: number, dto: Partial<CreateLeaveDto>) {
    const leave = await this.findOne(id);
    const student = await this.studentRepo.findOne({ where: { user_id: userId } });
    if (!student || leave.student_id !== student.id) {
      throw new ForbiddenException('无权修改此请假申请');
    }
    if (leave.status !== 'PENDING') {
      throw new ForbiddenException('只能修改待审批的请假申请');
    }
    if (dto.leaveType) leave.leave_type = dto.leaveType;
    if (dto.startDate) leave.start_date = dto.startDate;
    if (dto.endDate) leave.end_date = dto.endDate;
    if (dto.startPeriod) leave.start_period = dto.startPeriod;
    if (dto.endPeriod) leave.end_period = dto.endPeriod;
    if (dto.reason) leave.reason = dto.reason;
    return this.leaveRepo.save(leave);
  }

  async cancel(id: number, userId: number) {
    const leave = await this.findOne(id);
    const student = await this.studentRepo.findOne({ where: { user_id: userId } });
    if (!student || leave.student_id !== student.id) {
      throw new ForbiddenException('无权撤销此请假申请');
    }
    leave.status = 'CANCELLED';
    return this.leaveRepo.save(leave);
  }
}
