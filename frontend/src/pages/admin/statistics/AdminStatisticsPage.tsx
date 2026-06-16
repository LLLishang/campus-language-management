import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { TeamOutlined, FileTextOutlined, CalendarOutlined, ToolOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminStatisticsPage: React.FC = () => (
  <div>
    <Title level={4}>数据统计中心</Title>
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col xs={24} sm={12} lg={6}><Card><Statistic title="在校学生" value={3} prefix={<TeamOutlined />} valueStyle={{ color: '#1677FF' }} /></Card></Col>
      <Col xs={24} sm={12} lg={6}><Card><Statistic title="在职教师" value={2} prefix={<TeamOutlined />} valueStyle={{ color: '#52C41A' }} /></Card></Col>
      <Col xs={24} sm={12} lg={6}><Card><Statistic title="请假工单" value={0} prefix={<FileTextOutlined />} /></Card></Col>
      <Col xs={24} sm={12} lg={6}><Card><Statistic title="报修工单" value={0} prefix={<ToolOutlined />} /></Card></Col>
    </Row>
    <Card style={{ marginTop: 16 }}><Title level={5}>📊 图表功能</Title><p>图表统计功能将在后续版本中实现。</p></Card>
  </div>
);

export default AdminStatisticsPage;
