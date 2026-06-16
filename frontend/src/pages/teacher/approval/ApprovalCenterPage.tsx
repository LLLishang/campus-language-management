import React, { useEffect, useState } from 'react';
import { Card, Button, Space, Tag, Typography, message, Empty, Spin, Descriptions } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import http from '../../../services/http';

const { Title, Text, Paragraph } = Typography;

const typeMap: Record<string, string> = { SICK: '病假', PERSONAL: '事假', OTHER: '其他' };

interface ApprovalItem {
  id: number;
  type: 'LEAVE' | 'BOOKING';
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  startPeriod?: number;
  endPeriod?: number;
  reason?: string;
  applicant: { realName: string; className?: string };
  summary: string;
  status: string;
  createdAt: string;
}

const ApprovalCenterPage: React.FC = () => {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await http.get('/approval/pending');
      setItems(res.data || []);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (item: ApprovalItem) => {
    try {
      const url = item.type === 'LEAVE'
        ? `/approval/leave/${item.id}/approve`
        : `/approval/booking/${item.id}/approve`;
      await http.post(url);
      message.success('已批准');
      fetchData();
    } catch { /* handled */ }
  };

  const handleReject = async (item: ApprovalItem) => {
    try {
      const url = item.type === 'LEAVE'
        ? `/approval/leave/${item.id}/reject`
        : `/approval/booking/${item.id}/reject`;
      await http.post(url, { comment: '不符合审批条件' });
      message.success('已驳回');
      fetchData();
    } catch { /* handled */ }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={4}>审批中心</Title>
      {items.length === 0 ? (
        <Empty description="暂无待审批事项" />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {items.map((item) => (
            <Card key={`${item.type}-${item.id}`} size="small">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <Space wrap style={{ marginBottom: 4 }}>
                    <Tag color={item.type === 'LEAVE' ? 'blue' : 'green'}>
                      {item.type === 'LEAVE' ? '📋 请假' : '🏀 场地'}
                    </Tag>
                    <Text strong>{item.applicant.realName}</Text>
                    {item.applicant.className && <Text type="secondary">· {item.applicant.className}</Text>}
                    {item.leaveType && <Text type="secondary">· {typeMap[item.leaveType] || item.leaveType}</Text>}
                  </Space>
                  <div style={{ marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 15 }}>
                      {item.startDate} ~ {item.endDate}
                    </Text>
                    <Text style={{ marginLeft: 8 }}>
                      第{item.startPeriod}节 - 第{item.endPeriod}节
                    </Text>
                    <Text type="secondary" style={{ marginLeft: 4, fontSize: 12 }}>
                      （共{item.endPeriod && item.startPeriod ? item.endPeriod - item.startPeriod + 1 : '?'}节课）
                    </Text>
                  </div>
                  {item.reason && (
                    <Paragraph
                      ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
                      style={{ marginBottom: 4, background: '#fafafa', padding: '6px 10px', borderRadius: 4 }}
                    >
                      <Text type="secondary">事由：</Text>{item.reason}
                    </Paragraph>
                  )}
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    提交于 {new Date(item.createdAt).toLocaleString('zh-CN')}
                  </Text>
                </div>
                <Space style={{ marginLeft: 16, flexShrink: 0 }}>
                  <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleApprove(item)}>
                    批准
                  </Button>
                  <Button danger size="small" icon={<CloseOutlined />} onClick={() => handleReject(item)}>
                    驳回
                  </Button>
                </Space>
              </div>
            </Card>
          ))}
        </Space>
      )}
    </div>
  );
};

export default ApprovalCenterPage;
