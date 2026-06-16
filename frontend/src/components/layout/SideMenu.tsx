import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined, EditOutlined, CalendarOutlined, ToolOutlined, FileTextOutlined,
  CheckCircleOutlined, BellOutlined, TeamOutlined, SettingOutlined, BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

const { Sider } = Layout;

const studentMenu = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '首页概览', path: '/student/dashboard' },
  { key: 'leave', icon: <EditOutlined />, label: '请假管理', path: '/student/leave' },
  { key: 'venue', icon: <CalendarOutlined />, label: '场地预约', path: '/student/venue' },
  { key: 'bookings', icon: <CalendarOutlined />, label: '我的预约', path: '/student/bookings' },
  { key: 'repair', icon: <ToolOutlined />, label: '校园报修', path: '/student/repair' },
  { key: 'orders', icon: <FileTextOutlined />, label: '我的工单', path: '/student/orders' },
];

const teacherMenu = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '首页概览', path: '/teacher/dashboard' },
  { key: 'approval', icon: <CheckCircleOutlined />, label: '审批中心', path: '/teacher/approval' },
  { key: 'bookings', icon: <CalendarOutlined />, label: '预约管理', path: '/teacher/bookings' },
  { key: 'repair', icon: <ToolOutlined />, label: '报修管理', path: '/teacher/repair' },
  { key: 'leave', icon: <EditOutlined />, label: '学生请假', path: '/teacher/leave' },
];

const adminMenu = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '首页概览', path: '/admin/dashboard' },
  { key: 'orders', icon: <FileTextOutlined />, label: '全校工单', path: '/admin/orders' },
  { key: 'users', icon: <TeamOutlined />, label: '用户管理', path: '/admin/users' },
  { key: 'venues', icon: <CalendarOutlined />, label: '场地管理', path: '/admin/venues' },
  { key: 'repair', icon: <ToolOutlined />, label: '报修管理', path: '/admin/repair' },
  { key: 'statistics', icon: <BarChartOutlined />, label: '数据统计', path: '/admin/statistics' },
  { key: 'config', icon: <SettingOutlined />, label: '系统配置', path: '/admin/config' },
];

const menuConfig: Record<string, typeof studentMenu> = { STUDENT: studentMenu, TEACHER: teacherMenu, ADMIN: adminMenu };

export const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const role = user?.role || 'STUDENT';
  const items = (menuConfig[role] || studentMenu).map((item) => ({
    ...item, onClick: () => navigate(item.path),
  }));
  items.push({ key: 'notifications', icon: <BellOutlined />, label: '消息中心', path: '/notifications', onClick: () => navigate('/notifications') });

  const selectedKey = items.find((item) => {
    const prefix = role === 'ADMIN' ? '/admin/' : role === 'TEACHER' ? '/teacher/' : '/student/';
    return item.key !== 'notifications' ? location.pathname.startsWith(prefix + item.key) : location.pathname.startsWith('/notifications');
  })?.key || 'dashboard';

  return (
    <Sider width={220} style={{ overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }} breakpoint="lg" collapsible theme="dark">
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        🏫 校园管理
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={items} />
    </Sider>
  );
};
