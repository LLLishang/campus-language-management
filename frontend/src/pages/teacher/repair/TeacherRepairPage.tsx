import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Typography, message } from 'antd';
import http from '../../../services/http';

const { Title } = Typography;
const statusMap: Record<string, { color: string; text: string }> = { PENDING: { color: 'processing', text: '待处理' }, ASSIGNED: { color: 'warning', text: '已指派' }, IN_PROGRESS: { color: 'processing', text: '处理中' }, COMPLETED: { color: 'success', text: '已完成' }, CANCELLED: { color: 'default', text: '已取消' } };
const urgencyMap: Record<string, string> = { LOW: '低', MEDIUM: '中', HIGH: '高', URGENT: '紧急' };
const categoryMap: Record<string, string> = { ELECTRICAL: '电器', PLUMBING: '水暖', FURNITURE: '家具', IT: '网络', BUILDING: '建筑', OTHER: '其他' };

const TeacherRepairPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await http.get('/repair/all'); setData(res.data || []); } catch { /* */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const columns = [
    { title: '标题', dataIndex: 'title' },
    { title: '类别', dataIndex: 'category', render: (v: string) => categoryMap[v] || v },
    { title: '位置', dataIndex: 'location' },
    { title: '紧急', dataIndex: 'urgency', render: (v: string) => <Tag>{urgencyMap[v]}</Tag> },
    { title: '状态', dataIndex: 'status', render: (v: string) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag> },
    { title: '时间', dataIndex: 'created_at', render: (v: string) => new Date(v).toLocaleString('zh-CN') },
  ];

  return (
    <div>
      <Title level={4}>报修管理</Title>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default TeacherRepairPage;
