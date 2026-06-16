import React, { lazy, Suspense } from 'react';
import { Spin } from 'antd';

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

const lazyLoad = (factory: () => Promise<{ default: React.ComponentType<any> }>) => {
  const Comp = lazy(factory);
  return (
    <Suspense fallback={<Loading />}>
      <Comp />
    </Suspense>
  );
};

// 公共
export const LoginPage = () => lazyLoad(() => import('../pages/login/LoginPage'));

// 学生端
export const StudentDashboard = () => lazyLoad(() => import('../pages/student/StudentDashboard'));
export const StudentLeaveList = () => lazyLoad(() => import('../pages/student/leave/StudentLeaveList'));
export const LeaveCreatePage = () => lazyLoad(() => import('../pages/student/leave/LeaveCreatePage'));
export const LeaveDetailPage = () => lazyLoad(() => import('../pages/student/leave/LeaveDetailPage'));
export const VenueListPage = () => lazyLoad(() => import('../pages/student/venue/VenueListPage'));
export const VenueDetailPage = () => lazyLoad(() => import('../pages/student/venue/VenueDetailPage'));
export const MyBookingsPage = () => lazyLoad(() => import('../pages/student/bookings/MyBookingsPage'));
export const StudentRepairList = () => lazyLoad(() => import('../pages/student/repair/StudentRepairList'));
export const RepairCreatePage = () => lazyLoad(() => import('../pages/student/repair/RepairCreatePage'));
export const StudentOrdersPage = () => lazyLoad(() => import('../pages/student/orders/StudentOrdersPage'));

// 教师端
export const TeacherDashboard = () => lazyLoad(() => import('../pages/teacher/TeacherDashboard'));
export const ApprovalCenterPage = () => lazyLoad(() => import('../pages/teacher/approval/ApprovalCenterPage'));
export const TeacherBookingsPage = () => lazyLoad(() => import('../pages/teacher/bookings/TeacherBookingsPage'));
export const TeacherRepairPage = () => lazyLoad(() => import('../pages/teacher/repair/TeacherRepairPage'));
export const TeacherLeavePage = () => lazyLoad(() => import('../pages/teacher/leave/TeacherLeavePage'));

// 管理员端
export const AdminDashboard = () => lazyLoad(() => import('../pages/admin/AdminDashboard'));
export const AdminOrdersPage = () => lazyLoad(() => import('../pages/admin/orders/AdminOrdersPage'));
export const UserManagePage = () => lazyLoad(() => import('../pages/admin/users/UserManagePage'));
export const AdminVenueManagePage = () => lazyLoad(() => import('../pages/admin/venues/VenueManagePage'));
export const AdminRepairPage = () => lazyLoad(() => import('../pages/admin/repair/AdminRepairPage'));
export const AdminStatisticsPage = () => lazyLoad(() => import('../pages/admin/statistics/AdminStatisticsPage'));
export const SystemConfigPage = () => lazyLoad(() => import('../pages/admin/config/SystemConfigPage'));

// 通知
export const NotificationPage = () => lazyLoad(() => import('../pages/notification/NotificationPage'));

// 错误
export const ForbiddenPage = () => lazyLoad(() => import('../pages/error/ForbiddenPage'));
export const NotFoundPage = () => lazyLoad(() => import('../pages/error/NotFoundPage'));
