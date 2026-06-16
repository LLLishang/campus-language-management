import React from 'react';
import { Card, Empty, Typography } from 'antd';

const { Title } = Typography;

const NotificationPage: React.FC = () => {
  return (
    <div>
      <Title level={4}>消息中心</Title>
      <Card>
        <Empty description="暂无消息通知" />
      </Card>
    </div>
  );
};

export default NotificationPage;
