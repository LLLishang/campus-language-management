import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { TeamOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/auth.store';

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <Title level={4}>欢迎回来，{user?.realName}</Title>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="全校待处理工单" value={0} prefix={<FileTextOutlined />} valueStyle={{ color: '#FAAD14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="总用户数" value={0} prefix={<TeamOutlined />} valueStyle={{ color: '#1677FF' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="今日请假" value={0} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 16 }}>
        <Title level={5}>⚙️ 管理功能</Title>
        <p>更多管理功能正在开发中：用户管理、场地管理、报修管理、数据统计等。</p>
      </Card>
    </div>
  );
};

export default AdminDashboard;
