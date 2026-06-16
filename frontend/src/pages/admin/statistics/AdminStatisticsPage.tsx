import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Table, Tag } from 'antd';
import {
  TeamOutlined, FileTextOutlined, CalendarOutlined,
  ToolOutlined, EnvironmentOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import http from '../../../services/http';

const { Title, Text } = Typography;

const statusMap: Record<string, { color: string; text: string }> = {
  PENDING: { color: 'processing', text: '待处理' },
  APPROVED: { color: 'success', text: '已通过' },
  REJECTED: { color: 'error', text: '已驳回' },
  CANCELLED: { color: 'default', text: '已取消' },
  COMPLETED: { color: 'success', text: '已完成' },
  IN_PROGRESS: { color: 'processing', text: '处理中' },
  ASSIGNED: { color: 'warning', text: '已指派' },
};

const AdminStatisticsPage: React.FC = () => {
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
      <Title level={4}>数据统计中心</Title>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="在校学生" value={s.students || 0} prefix={<TeamOutlined />} valueStyle={{ color: '#1677FF' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="在职教师" value={s.teachers || 0} prefix={<TeamOutlined />} valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="请假工单" value={s.leaves || 0} prefix={<FileTextOutlined />} valueStyle={{ color: '#722ED1' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>待审批 {s.pendingLeaves || 0}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="报修工单" value={s.repairs || 0} prefix={<ToolOutlined />} valueStyle={{ color: '#FA8C16' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>待处理 {s.pendingRepairs || 0}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="场地数量" value={s.venues || 0} prefix={<EnvironmentOutlined />} valueStyle={{ color: '#13C2C2' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="预约总数" value={s.bookings || 0} prefix={<CalendarOutlined />} valueStyle={{ color: '#EB2F96' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="📊 近7天请假趋势">
            {s.recentLeaves?.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, paddingTop: 20 }}>
                {s.recentLeaves.map((item: any, i: number) => {
                  const maxCount = Math.max(...s.recentLeaves.map((d: any) => parseInt(d.count) || 0), 1);
                  const h = ((parseInt(item.count) || 0) / maxCount) * 140;
                  return (
                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{
                        height: h || 4,
                        background: 'linear-gradient(180deg, #722ED1, #d3adf7)',
                        borderRadius: '4px 4px 0 0', margin: '0 auto',
                        maxWidth: 48, transition: 'height 0.3s',
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
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无近7天数据</div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="📋 系统概览">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: 16, background: '#f6ffed', borderRadius: 8 }}>
                  <div style={{ fontSize: 32 }}>👥</div>
                  <Text strong>总用户 {s.users || 0}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: 16, background: '#e6f4ff', borderRadius: 8 }}>
                  <div style={{ fontSize: 32 }}>📝</div>
                  <Text strong>请假率 {s.leaves && s.students ? Math.round((s.leaves / s.students) * 100) : 0}%</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: 16, background: '#fff7e6', borderRadius: 8 }}>
                  <div style={{ fontSize: 32 }}>🔧</div>
                  <Text strong>报修率 {s.repairs && s.students ? Math.round((s.repairs / s.students) * 100) : 0}%</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: 16, background: '#f9f0ff', borderRadius: 8 }}>
                  <div style={{ fontSize: 32 }}>📅</div>
                  <Text strong>预约率 {s.bookings && s.users ? Math.round((s.bookings / s.users) * 100) : 0}%</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStatisticsPage;
