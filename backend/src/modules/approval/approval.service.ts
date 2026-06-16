import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { LeaveRequest } from '../leave/entities/leave-request.entity';
import { LeaveApproval } from '../leave/entities/leave-approval.entity';
import { Student } from '../user/entities/student.entity';
import { Teacher } from '../user/entities/teacher.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectRepository(LeaveRequest) private leaveRepo: Repository<LeaveRequest>,
    @InjectRepository(LeaveApproval) private approvalRepo: Repository<LeaveApproval>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getPending(userId: number) {
    const teacher = await this.teacherRepo.findOne({ where: { user_id: userId } });
    if (!teacher) throw new NotFoundException('教师信息不存在');

    const classes = teacher.managed_classes || [];
    if (classes.length === 0) return [];

    // 找到这些班级的所有学生
    const students = await this.studentRepo.find({
      where: { class_name: In(classes) },
    });
    const studentIds = students.map((s) => s.id);

    // 找到这些学生的待审批请假
    const leaves = await this.leaveRepo.find({
      where: { student_id: In(studentIds), status: 'PENDING' },
      order: { created_at: 'DESC' },
    });

    const results: any[] = [];
    for (const leave of leaves) {
      const student = students.find((s) => s.id === leave.student_id);
      const user = await this.userRepo.findOne({ where: { id: student?.user_id } });
      results.push({
        id: leave.id,
        type: 'LEAVE',
        leaveType: leave.leave_type,
        startDate: leave.start_date,
        endDate: leave.end_date,
        startPeriod: leave.start_period,
        endPeriod: leave.end_period,
        reason: leave.reason,
        applicant: {
          realName: user?.real_name || '未知',
          className: student?.class_name,
        },
        summary: `${leave.leave_type === 'SICK' ? '病假' : leave.leave_type === 'PERSONAL' ? '事假' : '其他'} ${leave.start_date} 第${leave.start_period}-${leave.end_period}节`,
        status: leave.status,
        createdAt: leave.created_at,
      });
    }
    return results;
  }

  async approveLeave(leaveId: number, userId: number) {
    const leave = await this.leaveRepo.findOne({ where: { id: leaveId } });
    if (!leave) throw new NotFoundException('请假记录不存在');
    if (leave.status !== 'PENDING') throw new ForbiddenException('该请假已处理');

    leave.status = 'APPROVED';
    await this.leaveRepo.save(leave);

    const approval = this.approvalRepo.create({
      leave_request_id: leaveId,
      approver_id: userId,
      action: 'APPROVE',
    });
    await this.approvalRepo.save(approval);
    return { message: '已批准' };
  }

  async rejectLeave(leaveId: number, userId: number, comment?: string) {
    const leave = await this.leaveRepo.findOne({ where: { id: leaveId } });
    if (!leave) throw new NotFoundException('请假记录不存在');
    if (leave.status !== 'PENDING') throw new ForbiddenException('该请假已处理');

    leave.status = 'REJECTED';
    await this.leaveRepo.save(leave);

    const approval = this.approvalRepo.create({
      leave_request_id: leaveId,
      approver_id: userId,
      action: 'REJECT',
      comment: comment || '不符合审批条件',
    });
    await this.approvalRepo.save(approval);
    return { message: '已驳回' };
  }
}
