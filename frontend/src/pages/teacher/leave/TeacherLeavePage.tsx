import React from 'react';
import { Typography, Empty } from 'antd';

const { Title } = Typography;

const TeacherLeavePage: React.FC = () => (
  <div>
    <Title level={4}>学生请假管理</Title>
    <Empty description="暂无学生请假记录" />
  </div>
);

export default TeacherLeavePage;
