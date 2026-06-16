import React, { useEffect, useState } from 'react';
import { Card, Timeline, Tag, Typography, Space, Spin, Empty } from 'antd';
import { EditOutlined, CalendarOutlined, ToolOutlined } from '@ant-design/icons';
import http from '../../../services/http';

const { Title, Text } = Typography;

interface OrderItem { id: number; type: string; title: string; date: string; status: string; desc: string; }

const StudentOrdersPage: React.FC = () => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      http.get('/leave').catch(() => ({ data: [] })),
      http.get('/venue/bookings').catch(() => ({ data: [] })),
      http.get('/repair').catch(() => ({ data: [] })),
    ]).then(([leaveRes, venueRes, repairRes]) => {
      const leaves = (leaveRes.data || []).map((l: any) => ({
        id: l.id, type: '请假', icon: <EditOutlined />,
        title: `${l.leaveType === 'SICK' ? '病假' : l.leaveType === 'PERSONAL' ? '事假' : '其他'}`,
        date: `${l.startDate} 第${l.startPeriod}-${l.endPeriod}节`, status: l.status, desc: l.reason,
      }));
      const venues = (venueRes.data || []).map((b: any) => ({
        id: b.id, type: '场地', icon: <CalendarOutlined />,
        title: b.venue?.name || '场地预约', date: `${b.booking_date} 第${b.start_period}-${b.end_period}节`,
        status: b.status, desc: b.purpose,
      }));
      const repairs = (repairRes.data || []).map((r: any) => ({
        id: r.id, type: '报修', icon: <ToolOutlined />,
        title: r.title, date: new Date(r.created_at).toLocaleString('zh-CN'), status: r.status, desc: r.description,
      }));
      setItems([...leaves, ...venues, ...repairs].sort((a, b) => b.date.localeCompare(a.date)));
    }).finally(() => setLoading(false));
  }, []);

  const statusMap: Record<string, string> = { PENDING: 'processing', APPROVED: 'success', REJECTED: 'error', CANCELLED: 'default', COMPLETED: 'success', ASSIGNED: 'warning', IN_PROGRESS: 'processing' };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (items.length === 0) return <Empty description="暂无工单" />;

  return (
    <div>
      <Title level={4}>我的工单</Title>
      <Timeline items={items.map((item) => ({
        dot: item.icon,
        children: (
          <Card size="small" key={`${item.type}-${item.id}`}>
            <Space>
              <Tag>{item.type}</Tag>
              <Text strong>{item.title}</Text>
              <Tag color={statusMap[item.status]}>{item.status}</Tag>
            </Space>
            <br /><Text type="secondary">{item.date}</Text>
            <br /><Text ellipsis style={{ maxWidth: '100%' }}>{item.desc}</Text>
          </Card>
        ),
      }))} />
    </div>
  );
};

export default StudentOrdersPage;
