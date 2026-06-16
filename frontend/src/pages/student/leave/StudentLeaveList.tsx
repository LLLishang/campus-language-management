import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Typography, message } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';

const { Text } = Typography;
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import http from '../../../services/http';

const { Title } = Typography;

interface LeaveRecord {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  startPeriod: number;
  endPeriod: number;
  reason: string;
  status: string;
  createdAt: string;
}

const statusMap: Record<string, { color: string; text: string }> = {
  PENDING: { color: 'processing', text: '待审批' },
  APPROVED: { color: 'success', text: '已通过' },
  REJECTED: { color: 'error', text: '已驳回' },
  CANCELLED: { color: 'default', text: '已撤销' },
};

const typeMap: Record<string, string> = {
  SICK: '病假',
  PERSONAL: '事假',
  OTHER: '其他',
};

const StudentLeaveList: React.FC = () => {
  const [data, setData] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await http.get('/leave');
      setData(res.data || []);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const columns: ColumnsType<LeaveRecord> = [
    {
      title: '类型',
      dataIndex: 'leaveType',
      width: 70,
      render: (v: string) => typeMap[v] || v,
    },
    {
      title: '请假时间',
      key: 'time',
      width: 280,
      render: (_, r) => (
        <div>
          <Text strong>{r.startDate}{r.startDate !== r.endDate ? ` ~ ${r.endDate}` : ''}</Text>
          <br />
          <Text type="secondary">
            第{r.startPeriod}节 - 第{r.endPeriod}节
            （共{r.endPeriod - r.startPeriod + 1}节课）
          </Text>
        </div>
      ),
    },
    {
      title: '事由',
      dataIndex: 'reason',
      ellipsis: true,
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: string) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text || v}</Tag>,
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (v: string) => new Date(v).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, r) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/student/leave/${r.id}`)}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>请假管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/student/leave/create')}>
          新建请假
        </Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default StudentLeaveList;
