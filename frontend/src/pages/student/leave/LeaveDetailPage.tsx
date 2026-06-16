import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Button, Space, Spin, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../../services/http';

const { Title } = Typography;

const statusMap: Record<string, { color: string; text: string }> = {
  PENDING: { color: 'processing', text: '待审批' },
  APPROVED: { color: 'success', text: '已通过' },
  REJECTED: { color: 'error', text: '已驳回' },
  CANCELLED: { color: 'default', text: '已撤销' },
};

const LeaveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    http.get(`/leave/${id}`).then((res) => setData(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!data) return <div>数据不存在</div>;

  return (
    <div style={{ maxWidth: 700 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/student/leave')}>返回</Button>
        <Title level={4} style={{ margin: 0 }}>请假详情</Title>
      </Space>
      <Card>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="请假类型">{data.leaveType === 'SICK' ? '病假' : data.leaveType === 'PERSONAL' ? '事假' : '其他'}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusMap[data.status]?.color}>{statusMap[data.status]?.text}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="日期">{data.startDate} ~ {data.endDate}</Descriptions.Item>
          <Descriptions.Item label="节次">第{data.startPeriod}节 - 第{data.endPeriod}节</Descriptions.Item>
          <Descriptions.Item label="事由" span={2}>{data.reason}</Descriptions.Item>
          <Descriptions.Item label="提交时间" span={2}>{new Date(data.createdAt).toLocaleString('zh-CN')}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default LeaveDetailPage;
