import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { CheckCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/auth.store';

const { Title } = Typography;

const TeacherDashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <Title level={4}>欢迎回来，{user?.realName}老师</Title>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="待审批" value={0} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#FAAD14' }} suffix="项" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="管理班级" value={user?.teacher?.managedClasses?.length || 0} prefix={<TeamOutlined />} suffix="个" />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 16 }}>
        <Title level={5}>📋 快捷操作</Title>
        <p>点击左侧菜单「审批中心」处理学生请假和场地预约申请。</p>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
