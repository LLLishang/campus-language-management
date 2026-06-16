import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { EditOutlined, CalendarOutlined, ToolOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/auth.store';

const { Title } = Typography;

const StudentDashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <Title level={4}>欢迎回来，{user?.realName}</Title>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="待审批请假" value={0} prefix={<EditOutlined />} valueStyle={{ color: '#1677FF' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="待审批预约" value={0} prefix={<CalendarOutlined />} valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="进行中报修" value={0} prefix={<ToolOutlined />} valueStyle={{ color: '#FAAD14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="全部工单" value={0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 16 }}>
        <Title level={5}>📋 快捷操作</Title>
        <p>点击左侧菜单「请假管理」开始提交请假申请。</p>
      </Card>
    </div>
  );
};

export default StudentDashboard;
