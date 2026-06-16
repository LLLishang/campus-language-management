import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Select, Space } from 'antd';
import http from '../../../services/http';

const { Title } = Typography;

const typeMap: Record<string, string> = { LEAVE: '请假', BOOKING: '场地', REPAIR: '报修' };
const statusMap: Record<string, string> = { PENDING: 'processing', APPROVED: 'success', REJECTED: 'error', CANCELLED: 'default', COMPLETED: 'success', ASSIGNED: 'warning', IN_PROGRESS: 'processing' };

const AdminOrdersPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leaveRes, venueRes, repairRes] = await Promise.all([
        http.get('/leave/all').catch(() => ({ data: [] })),
        http.get('/venue/bookings/all').catch(() => ({ data: [] })),
        http.get('/repair/all').catch(() => ({ data: [] })),
      ]);
      const items = [
        ...(leaveRes.data || []).map((l: any) => ({ key: `leave-${l.id}`, type: 'LEAVE', applicant: l.student_name || '未知', summary: `${l.leave_type} ${l.start_date} 第${l.start_period}-${l.end_period}节`, status: l.status, date: l.created_at })),
        ...(venueRes.data || []).map((b: any) => ({ key: `venue-${b.id}`, type: 'BOOKING', applicant: b.user_name || '未知', summary: `${b.venue?.name || '场地'} ${b.booking_date}`, status: b.status, date: b.created_at })),
        ...(repairRes.data || []).map((r: any) => ({ key: `repair-${r.id}`, type: 'REPAIR', applicant: r.reporter_name || '未知', summary: r.title, status: r.status, date: r.created_at })),
      ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setData(items);
    } catch { /* */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const columns = [
    { title: '类型', dataIndex: 'type', render: (v: string) => <Tag>{typeMap[v]}</Tag> },
    { title: '申请人', dataIndex: 'applicant' },
    { title: '摘要', dataIndex: 'summary', ellipsis: true },
    { title: '状态', dataIndex: 'status', render: (v: string) => <Tag color={statusMap[v]}>{v}</Tag> },
    { title: '时间', dataIndex: 'date', render: (v: string) => new Date(v).toLocaleString('zh-CN') },
  ];

  return (
    <div>
      <Title level={4}>全校工单管理</Title>
      <Table columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default AdminOrdersPage;
