import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../modules/user/entities/user.entity';
import { Student } from '../modules/user/entities/student.entity';
import { Teacher } from '../modules/user/entities/teacher.entity';
import { CourseSchedule } from '../modules/user/entities/course-schedule.entity';
import { Venue } from '../modules/venue/entities/venue.entity';

async function seed() {
  const ds = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'campus_management',
    entities: [User, Student, Teacher, CourseSchedule, Venue],
    synchronize: true,
  });

  await ds.initialize();
  console.log('📦 数据库已连接，开始写入种子数据...');

  const userRepo = ds.getRepository(User);
  const studentRepo = ds.getRepository(Student);
  const teacherRepo = ds.getRepository(Teacher);
  const scheduleRepo = ds.getRepository(CourseSchedule);

  // 1. 课程时间表
  const schedules = [
    { period_no: 1, start_time: '08:30', end_time: '09:15', break_duration: 10, block: 'A' },
    { period_no: 2, start_time: '09:25', end_time: '10:10', break_duration: 20, block: 'A' },
    { period_no: 3, start_time: '10:30', end_time: '11:15', break_duration: 10, block: 'B' },
    { period_no: 4, start_time: '11:25', end_time: '12:10', break_duration: 120, block: 'B' },
    { period_no: 5, start_time: '14:30', end_time: '15:15', break_duration: 10, block: 'C' },
    { period_no: 6, start_time: '15:25', end_time: '16:10', break_duration: 20, block: 'C' },
    { period_no: 7, start_time: '16:30', end_time: '17:15', break_duration: 10, block: 'D' },
    { period_no: 8, start_time: '17:25', end_time: '18:10', break_duration: 80, block: 'D' },
    { period_no: 9, start_time: '19:30', end_time: '20:15', break_duration: 10, block: 'E' },
    { period_no: 10, start_time: '20:25', end_time: '21:10', break_duration: 0, block: 'E' },
  ];

  const existing = await scheduleRepo.count();
  if (existing === 0) {
    await scheduleRepo.save(schedules);
    console.log('✅ 课程时间表已写入 (10节)');
  } else {
    console.log('⏭️ 课程时间表已存在，跳过');
  }

  // 2. 管理员
  const adminCount = await userRepo.count({ where: { role: UserRole.ADMIN } });
  if (adminCount === 0) {
    const admin = userRepo.create({
      username: 'admin',
      password_hash: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
      real_name: '系统管理员',
      phone: '13800000000',
      email: 'admin@campus.edu',
    });
    await userRepo.save(admin);
    console.log('✅ 管理员账号已创建: admin / admin123');
  }

  // 3. 测试学生
  const studentCount = await userRepo.count({ where: { role: UserRole.STUDENT } });
  if (studentCount === 0) {
    const studentUsers = [
      { username: '13800138001', real_name: '张三', phone: '13800138001' },
      { username: '13800138002', real_name: '李四', phone: '13800138002' },
      { username: '13800138003', real_name: '王五', phone: '13800138003' },
    ];

    const studentData = [
      { student_no: '20210001', class_name: '计算机科学2101', grade: '2021级', department: '计算机学院', dormitory: '3号楼A区501' },
      { student_no: '20210002', class_name: '计算机科学2102', grade: '2021级', department: '计算机学院', dormitory: '3号楼A区502' },
      { student_no: '20210003', class_name: '软件工程2101', grade: '2021级', department: '软件学院', dormitory: '5号楼B区301' },
    ];

    for (let i = 0; i < studentUsers.length; i++) {
      const u = userRepo.create({
        ...studentUsers[i],
        password_hash: await bcrypt.hash('123456', 10),
        role: UserRole.STUDENT,
      });
      const saved = await userRepo.save(u);
      const s = studentRepo.create({ user_id: saved.id, ...studentData[i] });
      await studentRepo.save(s);
    }
    console.log('✅ 测试学生账号已创建 (3个): 13800138001~3 / 123456');
  }

  // 4. 测试教师
  const teacherCount = await userRepo.count({ where: { role: UserRole.TEACHER } });
  if (teacherCount === 0) {
    const teacherUsers = [
      { username: '13800138004', real_name: '李教授', phone: '13800138004' },
      { username: '13800138005', real_name: '王老师', phone: '13800138005' },
    ];

    const teacherData = [
      { teacher_no: 'T2021001', title: '教授', department: '计算机学院', managed_classes: ['计算机科学2101', '计算机科学2102'] },
      { teacher_no: 'T2021002', title: '副教授', department: '软件学院', managed_classes: ['软件工程2101'] },
    ];

    for (let i = 0; i < teacherUsers.length; i++) {
      const u = userRepo.create({
        ...teacherUsers[i],
        password_hash: await bcrypt.hash('123456', 10),
        role: UserRole.TEACHER,
      });
      const saved = await userRepo.save(u);
      const t = teacherRepo.create({ user_id: saved.id, ...teacherData[i] });
      await teacherRepo.save(t);
    }
    console.log('✅ 测试教师账号已创建 (2个): 13800138004~5 / 123456');
  }

  // 5. 场地数据
  const venueRepo = ds.getRepository(Venue);
  const venueCount = await venueRepo.count();
  if (venueCount === 0) {
    const venues = venueRepo.create([
      { name: '体育馆篮球场', category: 'SPORTS', location: '体育馆1楼东侧', capacity: 100, facilities: ['篮球架×4', '计分板', '更衣室'], is_active: true, open_periods: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { name: '学术报告厅', category: 'MEETING', location: '行政楼3楼', capacity: 300, facilities: ['投影仪', '音响系统', '空调'], is_active: true, open_periods: [1, 2, 3, 4, 5, 6, 7, 8] },
      { name: '计算机实验室A区', category: 'LAB', location: '博学楼5楼', capacity: 60, facilities: ['电脑×60', '投影仪', '空调'], is_active: true, open_periods: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { name: '博学楼201教室', category: 'CLASSROOM', location: '博学楼2楼', capacity: 80, facilities: ['多媒体讲台', '投影仪', '空调'], is_active: true, open_periods: [5, 6, 7, 8, 9, 10] },
      { name: '会议室B', category: 'MEETING', location: '行政楼2楼', capacity: 20, facilities: ['投影仪', '白板'], is_active: true, open_periods: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    ]);
    await venueRepo.save(venues);
    console.log('✅ 场地数据已创建 (5个)');
  } else {
    console.log('⏭️ 场地数据已存在，跳过');
  }

  console.log('🎉 种子数据写入完成！');
  console.log('────────────────────────────────────');
  console.log('  管理员: admin / admin123');
  console.log('  学生: 13800138001 / 123456 (张三)');
  console.log('  学生: 13800138002 / 123456 (李四)');
  console.log('  学生: 13800138003 / 123456 (王五)');
  console.log('  教师: 13800138004 / 123456 (李教授)');
  console.log('  教师: 13800138005 / 123456 (王老师)');
  console.log('────────────────────────────────────');

  await ds.destroy();
}

seed().catch((err) => {
  console.error('种子数据写入失败:', err.message);
  process.exit(1);
});
