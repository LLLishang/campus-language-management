import React, { useEffect } from 'react';
import { Badge, Popover, List, Button, Typography, Space, Tag } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../stores/notification.store';

const { Text } = Typography;

const typeMap: Record<string, { color: string; label: string }> = {
  LEAVE_UPDATE: { color: 'blue', label: '请假' },
  BOOKING_UPDATE: { color: 'green', label: '场地' },
  REPAIR_UPDATE: { color: 'orange', label: '报修' },
  SYSTEM: { color: 'purple', label: '系统' },
  AI_REMINDER: { color: 'cyan', label: 'AI' },
};

const NotificationBell: React.FC = () => {
  const { unreadCount, list, loading, fetchUnreadCount, fetchList, markRead } =
    useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    const stop = useNotificationStore.getState().startPolling();
    return stop;
  }, []);

  const content = (
    <div style={{ width: 360, maxHeight: 480 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 8px 0' }}>
        <Text strong>消息通知</Text>
        <Button size="small" type="link" onClick={() => navigate('/notifications')}>
          查看全部
        </Button>
      </div>
      {list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 24, color: '#999' }}>暂无消息</div>
      ) : (
        <List
          loading={loading}
          dataSource={list.slice(0, 5)}
          style={{ maxHeight: 360, overflow: 'auto' }}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '8px 12px',
                background: item.isRead ? '#fff' : '#f0f5ff',
                cursor: 'pointer',
              }}
              onClick={async () => {
                if (!item.isRead) await markRead(item.id);
                if (item.refType && item.refId) {
                  const routeMap: Record<string, string> = {
                    leave: `/student/leave/${item.refId}`,
                    booking: '/student/bookings',
                    repair: `/student/repair`,
                  };
                  navigate(routeMap[item.refType] || '/notifications');
                }
              }}
            >
              <div style={{ width: '100%' }}>
                <Space style={{ marginBottom: 2 }}>
                  <Tag color={typeMap[item.type]?.color} style={{ fontSize: 10 }}>
                    {typeMap[item.type]?.label || item.type}
                  </Tag>
                  {!item.isRead && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1677ff' }} />}
                </Space>
                <div>
                  <Text strong style={{ fontSize: 13 }}>{item.title}</Text>
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

  return (
    <Popover content={content} trigger="click" placement="bottomRight" onOpenChange={() => fetchList()}>
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
      </Badge>
    </Popover>
  );
};

export default NotificationBell;
