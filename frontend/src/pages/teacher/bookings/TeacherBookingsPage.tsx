import React from 'react';
import { Typography, Empty } from 'antd';

const { Title } = Typography;

const TeacherBookingsPage: React.FC = () => (
  <div>
    <Title level={4}>预约管理</Title>
    <Empty description="暂无班级学生的场地预约" />
  </div>
);

export default TeacherBookingsPage;
