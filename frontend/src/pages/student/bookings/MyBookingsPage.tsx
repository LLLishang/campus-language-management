import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Button, message } from 'antd';
import http from '../../../services/http';

const { Title } = Typography;

const statusMap: Record<string, { color: string; text: string }> = {
  PENDING: { color: 'processing', text: '待审批' },
  APPROVED: { color: 'success', text: '已通过' },
  REJECTED: { color: 'error', text: '已驳回' },
  CANCELLED: { color: 'default', text: '已取消' },
};

const MyBookingsPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await http.get('/venue/bookings'); setData(res.data || []); } catch { /* */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCancel = async (id: number) => {
    try { await http.delete(`/venue/bookings/${id}`); message.success('已取消'); fetchData(); } catch { /* */ }
  };

  const columns = [
    { title: '场地', render: (_: any, r: any) => r.venue?.name || '-' },
    { title: '日期', render: (_: any, r: any) => r.booking_date },
    { title: '时段', render: (_: any, r: any) => `第${r.start_period}-${r.end_period}节` },
    { title: '用途', dataIndex: 'purpose', ellipsis: true },
    { title: '状态', dataIndex: 'status', render: (v: string) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag> },
    { title: '操作', render: (_: any, r: any) => r.status === 'PENDING' ? <Button size="small" danger onClick={() => handleCancel(r.id)}>取消</Button> : null },
  ];

  return (
    <div>
      <Title level={4}>我的预约</Title>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default MyBookingsPage;
