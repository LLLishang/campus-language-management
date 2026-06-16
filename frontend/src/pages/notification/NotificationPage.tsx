import React, { useEffect, useState } from 'react';
import { List, Card, Tag, Typography, Button, Space, Segmented, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../stores/notification.store';

const { Title, Text } = Typography;

const typeMap: Record<string, { color: string; label: string }> = {
  LEAVE_UPDATE: { color: 'blue', label: '请假' },
  BOOKING_UPDATE: { color: 'green', label: '场地' },
  REPAIR_UPDATE: { color: 'orange', label: '报修' },
  SYSTEM: { color: 'purple', label: '系统' },
  AI_REMINDER: { color: 'cyan', label: 'AI' },
};

const NotificationPage: React.FC = () => {
  const { list, loading, fetchList, markRead, markAllRead } = useNotificationStore();
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchList(filter === 'unread' ? false : filter === 'read' ? true : undefined);
  }, [filter]);

  const handleClick = async (item: any) => {
    if (!item.isRead) await markRead(item.id);
    const refRouteMap: Record<string, string> = {
      leave: `/student/leave/${item.refId}`,
      booking: '/student/bookings',
      repair: '/student/repair',
    };
    if (item.refType && refRouteMap[item.refType]) {
      navigate(refRouteMap[item.refType]);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>消息中心</Title>
        <Space>
          <Segmented
            options={[
              { label: '全部', value: 'all' },
              { label: '未读', value: 'unread' },
              { label: '已读', value: 'read' },
            ]}
            value={filter}
            onChange={(v) => setFilter(v as string)}
          />
          <Button size="small" onClick={markAllRead}>全部已读</Button>
        </Space>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
      ) : list.length === 0 ? (
        <Card><Empty description="暂无通知消息" /></Card>
      ) : (
        <List
          dataSource={list}
          renderItem={(item: any) => (
            <List.Item
              style={{
                padding: '12px 16px',
                background: item.isRead ? '#fff' : '#f0f5ff',
                cursor: 'pointer',
                borderRadius: 8,
                marginBottom: 8,
              }}
              onClick={() => handleClick(item)}
            >
              <div style={{ width: '100%' }}>
                <Space style={{ marginBottom: 4 }}>
                  <Tag color={typeMap[item.type]?.color}>{typeMap[item.type]?.label || item.type}</Tag>
                  {!item.isRead && <Tag color="blue">新</Tag>}
                </Space>
                <div>
                  <Text strong style={{ fontSize: 14 }}>{item.title}</Text>
                </div>
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary">{item.content}</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {new Date(item.createdAt).toLocaleString('zh-CN')}
                </Text>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default NotificationPage;
