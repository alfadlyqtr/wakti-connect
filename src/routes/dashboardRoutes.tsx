
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import DashboardTasks from '@/pages/dashboard/DashboardTasks';
import DashboardMessages from '@/pages/dashboard/DashboardMessages';
import DashboardContacts from '@/pages/dashboard/DashboardContacts';
import DashboardServices from '@/pages/dashboard/DashboardServiceManagement';
import DashboardUpgrade from '@/pages/dashboard/DashboardUpgrade';
import DashboardPaymentConfirmation from '@/pages/dashboard/DashboardPaymentConfirmation';
import DashboardSettings from '@/pages/dashboard/DashboardSettings';
import DashboardNotifications from '@/pages/dashboard/DashboardNotifications';
import DashboardBusinessPage from '@/pages/dashboard/DashboardBusinessPage';
import DashboardSubscribers from '@/pages/dashboard/DashboardSubscribers';
import DashboardWorkManagement from '@/pages/dashboard/DashboardWorkManagement';
import DashboardTeamManagement from '@/pages/dashboard/DashboardTeamManagement';
import DashboardAnalyticsHub from '@/pages/dashboard/DashboardAnalyticsHub';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const dashboardRoutes = (
  <>
    <Route path="" element={<DashboardHome />} />
    <Route path="tasks" element={<DashboardTasks />} />
    <Route path="messages" element={<DashboardMessages />} />
    <Route path="contacts" element={<DashboardContacts />} />
    
    {/* Routes that require business account */}
    <Route path="services" element={
      <ProtectedRoute requiredRole="business">
        <DashboardServices />
      </ProtectedRoute>
    } />
    <Route path="work-management" element={
      <ProtectedRoute requiredRole="business">
        <DashboardWorkManagement />
      </ProtectedRoute>
    } />
    <Route path="team-management" element={
      <ProtectedRoute requiredRole="business">
        <DashboardTeamManagement />
      </ProtectedRoute>
    } />
    <Route path="analytics-hub" element={
      <ProtectedRoute requiredRole="business">
        <DashboardAnalyticsHub />
      </ProtectedRoute>
    } />
    <Route path="business-page" element={
      <ProtectedRoute requiredRole="business">
        <DashboardBusinessPage />
      </ProtectedRoute>
    } />
    <Route path="subscribers" element={
      <ProtectedRoute requiredRole="business">
        <DashboardSubscribers />
      </ProtectedRoute>
    } />
    
    {/* General routes accessible to all account types */}
    <Route path="upgrade" element={<DashboardUpgrade />} />
    <Route path="payment-confirmation" element={<DashboardPaymentConfirmation />} />
    <Route path="settings" element={<DashboardSettings />} />
    <Route path="notifications" element={<DashboardNotifications />} />
    
    {/* Catch-all redirect for invalid dashboard routes */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </>
);

export default dashboardRoutes;
