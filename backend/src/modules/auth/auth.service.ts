import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../user/entities/user.entity';
import { Student } from '../user/entities/student.entity';
import { Teacher } from '../user/entities/teacher.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: dto.username, role: dto.role },
      select: ['id', 'username', 'password_hash', 'role', 'real_name', 'phone', 'email', 'avatar_url', 'is_active'],
    });

    if (!user) throw new UnauthorizedException('账号或密码错误');
    if (!user.is_active) throw new UnauthorizedException('账号已被禁用');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('账号或密码错误');

    // 更新最后登录时间
    await this.userRepo.update(user.id, { last_login_at: new Date() });

    const payload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const profile: any = {
      id: user.id,
      username: user.username,
      role: user.role,
      realName: user.real_name,
      phone: user.phone,
      email: user.email,
      avatarUrl: user.avatar_url,
    };

    if (user.role === UserRole.STUDENT) {
      const student = await this.studentRepo.findOne({ where: { user_id: user.id } });
      if (student) {
        profile.student = {
          studentNo: student.student_no,
          className: student.class_name,
          grade: student.grade,
          department: student.department,
        };
      }
    } else if (user.role === UserRole.TEACHER) {
      const teacher = await this.teacherRepo.findOne({ where: { user_id: user.id } });
      if (teacher) {
        profile.teacher = {
          teacherNo: teacher.teacher_no,
          title: teacher.title,
          department: teacher.department,
          managedClasses: teacher.managed_classes,
        };
      }
    }

    return { accessToken, refreshToken, expiresIn: 7200, user: profile };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const accessToken = this.jwtService.sign(
        { sub: payload.sub, username: payload.username, role: payload.role },
        { expiresIn: '2h' },
      );
      return { accessToken, expiresIn: 7200 };
    } catch {
      throw new UnauthorizedException('刷新令牌无效');
    }
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('用户不存在');

    const profile: any = {
      id: user.id,
      username: user.username,
      role: user.role,
      realName: user.real_name,
      phone: user.phone,
      email: user.email,
      avatarUrl: user.avatar_url,
    };

    if (user.role === UserRole.STUDENT) {
      const student = await this.studentRepo.findOne({ where: { user_id: user.id } });
      if (student) {
        profile.student = {
          studentNo: student.student_no,
          className: student.class_name,
          grade: student.grade,
          department: student.department,
        };
      }
    } else if (user.role === UserRole.TEACHER) {
      const teacher = await this.teacherRepo.findOne({ where: { user_id: user.id } });
      if (teacher) {
        profile.teacher = {
          teacherNo: teacher.teacher_no,
          title: teacher.title,
          department: teacher.department,
          managedClasses: teacher.managed_classes,
        };
      }
    }

    return profile;
  }

  async updateProfile(userId: number, data: { real_name?: string; phone?: string; email?: string }) {
    await this.userRepo.update(userId, data);
    return this.getProfile(userId);
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'password_hash'],
    });
    if (!user) throw new BadRequestException('用户不存在');

    const valid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!valid) throw new BadRequestException('原密码错误');

    const hash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(userId, { password_hash: hash });
    return { message: '密码修改成功' };
  }
}
