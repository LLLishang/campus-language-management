import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin } from 'antd';
import {
  TeamOutlined, FileTextOutlined, ToolOutlined,
  EnvironmentOutlined, ClockCircleOutlined, AlertOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../stores/auth.store';
import http from '../../services/http';

const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get('/admin/statistics')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  const s = stats || {};

  return (
    <div>
      <Title level={4}>欢迎回来，{user?.realName}</Title>
      <Text type="secondary">校园管理系统运行概况</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="总用户数" value={s.users || 0} prefix={<TeamOutlined />} valueStyle={{ color: '#1677FF' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>学生 {s.students || 0} · 教师 {s.teachers || 0}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="请假总数" value={s.leaves || 0} prefix={<FileTextOutlined />} valueStyle={{ color: '#722ED1' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>待审批 {s.pendingLeaves || 0} 条</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="报修工单" value={s.repairs || 0} prefix={<ToolOutlined />} valueStyle={{ color: '#FA8C16' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>待处理 {s.pendingRepairs || 0} 条</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="场地数量" value={s.venues || 0} prefix={<EnvironmentOutlined />} valueStyle={{ color: '#52C41A' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>预约 {s.bookings || 0} 次</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="📊 近7天请假趋势">
            {s.recentLeaves?.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
                {s.recentLeaves.map((item: any, i: number) => {
                  const maxCount = Math.max(...s.recentLeaves.map((d: any) => parseInt(d.count) || 0), 1);
                  const h = ((parseInt(item.count) || 0) / maxCount) * 140;
                  return (
                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{
                        height: h, background: 'linear-gradient(180deg, #1677FF, #69b1ff)',
                        borderRadius: '4px 4px 0 0', margin: '0 auto',
                        maxWidth: 40, transition: 'height 0.3s',
                      }} />
                      <Text style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
                        {item.date?.slice(5)}
                      </Text>
                      <Text strong style={{ fontSize: 13 }}>{item.count}</Text>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无数据</div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="⚡ 待处理事项">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" style={{ background: '#fff7e6', border: '1px solid #ffd591' }}>
                  <Statistic title="待审批请假" value={s.pendingLeaves || 0}
                    prefix={<AlertOutlined />} valueStyle={{ color: '#FA8C16', fontSize: 28 }} />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ background: '#fff1f0', border: '1px solid #ffa39e' }}>
                  <Statistic title="待处理报修" value={s.pendingRepairs || 0}
                    prefix={<AlertOutlined />} valueStyle={{ color: '#F5222D', fontSize: 28 }} />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
