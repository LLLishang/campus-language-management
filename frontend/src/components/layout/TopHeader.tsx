import React from 'react';
import { Layout, Space, Avatar, Dropdown, Badge, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, BellOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

export const TopHeader: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const roleMap = { STUDENT: '学生', TEACHER: '教师', ADMIN: '管理员' };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: `${user?.realName} (${roleMap[user?.role || 'STUDENT']})`,
        disabled: true,
      },
      { type: 'divider' as const },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Space size="large">
        <Badge count={0} size="small">
          <BellOutlined
            style={{ fontSize: 18, cursor: 'pointer' }}
            onClick={() => navigate('/notifications')}
          />
        </Badge>
        <Dropdown menu={dropdownItems} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677FF' }} />
            <Text>{user?.realName}</Text>
            <Text type="secondary">{roleMap[user?.role || 'STUDENT']}</Text>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};
