import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';
import { RequireRole } from './RequireRole';
import { MainLayout } from '../components/layout/MainLayout';
import * as R from './routes';

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<R.LoginPage />} />
      <Route path="/403" element={<R.ForbiddenPage />} />
      <Route path="/404" element={<R.NotFoundPage />} />

      {/* 学生端 */}
      <Route path="/student/*" element={<RequireAuth><RequireRole roles={['STUDENT']}><MainLayout /></RequireRole></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<R.StudentDashboard />} />
        <Route path="leave" element={<R.StudentLeaveList />} />
        <Route path="leave/create" element={<R.LeaveCreatePage />} />
        <Route path="leave/:id" element={<R.LeaveDetailPage />} />
        <Route path="venue" element={<R.VenueListPage />} />
        <Route path="venue/:id" element={<R.VenueDetailPage />} />
        <Route path="bookings" element={<R.MyBookingsPage />} />
        <Route path="repair" element={<R.StudentRepairList />} />
        <Route path="repair/create" element={<R.RepairCreatePage />} />
        <Route path="orders" element={<R.StudentOrdersPage />} />
      </Route>

      {/* 教师端 */}
      <Route path="/teacher/*" element={<RequireAuth><RequireRole roles={['TEACHER']}><MainLayout /></RequireRole></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<R.TeacherDashboard />} />
        <Route path="approval" element={<R.ApprovalCenterPage />} />
        <Route path="bookings" element={<R.TeacherBookingsPage />} />
        <Route path="repair" element={<R.TeacherRepairPage />} />
        <Route path="leave" element={<R.TeacherLeavePage />} />
      </Route>

      {/* 管理员端 */}
      <Route path="/admin/*" element={<RequireAuth><RequireRole roles={['ADMIN']}><MainLayout /></RequireRole></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<R.AdminDashboard />} />
        <Route path="orders" element={<R.AdminOrdersPage />} />
        <Route path="users" element={<R.UserManagePage />} />
        <Route path="venues" element={<R.AdminVenueManagePage />} />
        <Route path="repair" element={<R.AdminRepairPage />} />
        <Route path="statistics" element={<R.AdminStatisticsPage />} />
        <Route path="config" element={<R.SystemConfigPage />} />
      </Route>

      <Route path="/notifications" element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route index element={<R.NotificationPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<R.NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
