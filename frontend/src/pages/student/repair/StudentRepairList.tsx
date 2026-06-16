import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Typography } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import http from '../../../services/http';

const { Title } = Typography;

const statusMap: Record<string, { color: string; text: string }> = {
  PENDING: { color: 'processing', text: '待处理' },
  ASSIGNED: { color: 'warning', text: '已指派' },
  IN_PROGRESS: { color: 'processing', text: '处理中' },
  COMPLETED: { color: 'success', text: '已完成' },
  CANCELLED: { color: 'default', text: '已取消' },
};

const urgencyMap: Record<string, string> = { LOW: '低', MEDIUM: '中', HIGH: '高', URGENT: '紧急' };
const urgencyColor: Record<string, string> = { LOW: 'green', MEDIUM: 'gold', HIGH: 'orange', URGENT: 'red' };

const categoryMap: Record<string, string> = { ELECTRICAL: '电器', PLUMBING: '水暖', FURNITURE: '家具', IT: '网络', BUILDING: '建筑', OTHER: '其他' };

const StudentRepairList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    http.get('/repair').then((res) => setData(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: '标题', dataIndex: 'title' },
    { title: '类别', dataIndex: 'category', render: (v: string) => categoryMap[v] || v },
    { title: '紧急', dataIndex: 'urgency', render: (v: string) => <Tag color={urgencyColor[v]}>{urgencyMap[v]}</Tag> },
    { title: '状态', dataIndex: 'status', render: (v: string) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag> },
    { title: '时间', dataIndex: 'created_at', render: (v: string) => new Date(v).toLocaleString('zh-CN') },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => navigate(`/student/repair/${r.id}`)}>详情</Button> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>校园报修</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/student/repair/create')}>新建报修</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default StudentRepairList;
