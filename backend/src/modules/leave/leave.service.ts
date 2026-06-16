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

  // 获取原始实体（内部使用）
  private async getEntity(id: number): Promise<LeaveRequest> {
    const leave = await this.leaveRepo.findOne({ where: { id } });
    if (!leave) throw new NotFoundException('请假记录不存在');
    return leave;
  }

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
    const leaves = await this.leaveRepo.find({
      where: { student_id: student.id },
      order: { created_at: 'DESC' },
    });
    return leaves.map((l) => ({
      id: l.id,
      leaveType: l.leave_type,
      startDate: l.start_date,
      endDate: l.end_date,
      startPeriod: l.start_period,
      endPeriod: l.end_period,
      reason: l.reason,
      status: l.status,
      createdAt: l.created_at,
      attachmentUrls: l.attachment_urls,
    }));
  }

  async findAll() {
    const leaves = await this.leaveRepo.find({ order: { created_at: 'DESC' } });
    const results: any[] = [];
    for (const l of leaves) {
      const student = await this.studentRepo.findOne({ where: { id: l.student_id } });
      const user = student ? await this.userRepo.findOne({ where: { id: student.user_id } }) : null;
      results.push({
        id: l.id,
        leaveType: l.leave_type,
        startDate: l.start_date,
        endDate: l.end_date,
        startPeriod: l.start_period,
        endPeriod: l.end_period,
        reason: l.reason,
        status: l.status,
        createdAt: l.created_at,
        attachmentUrls: l.attachment_urls,
        studentName: user?.real_name,
        className: student?.class_name,
      });
    }
    return results;
  }

  // 对外 API 使用，返回驼峰命名的详情
  async findOne(id: number) {
    const leave = await this.getEntity(id);
    const student = await this.studentRepo.findOne({ where: { id: leave.student_id } });
    const user = student ? await this.userRepo.findOne({ where: { id: student.user_id } }) : null;
    return {
      id: leave.id,
      studentId: leave.student_id,
      leaveType: leave.leave_type,
      startDate: leave.start_date,
      endDate: leave.end_date,
      startPeriod: leave.start_period,
      endPeriod: leave.end_period,
      reason: leave.reason,
      status: leave.status,
      createdAt: leave.created_at,
      attachmentUrls: leave.attachment_urls,
      studentName: user?.real_name,
      className: student?.class_name,
    };
  }

  async update(id: number, userId: number, dto: Partial<CreateLeaveDto>) {
    const leave = await this.getEntity(id);
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
    const leave = await this.getEntity(id);
    const student = await this.studentRepo.findOne({ where: { user_id: userId } });
    if (!student || leave.student_id !== student.id) {
      throw new ForbiddenException('无权撤销此请假申请');
    }
    leave.status = 'CANCELLED';
    return this.leaveRepo.save(leave);
  }
}
