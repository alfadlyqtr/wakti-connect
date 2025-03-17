
import React from 'react';
import { Route } from 'react-router-dom';
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

const dashboardRoutes = (
  <>
    <Route path="" element={<DashboardHome />} />
    <Route path="tasks" element={<DashboardTasks />} />
    <Route path="messages" element={<DashboardMessages />} />
    <Route path="contacts" element={<DashboardContacts />} />
    <Route path="services" element={<DashboardServices />} />
    <Route path="work-management" element={<DashboardWorkManagement />} />
    <Route path="team-management" element={<DashboardTeamManagement />} />
    <Route path="analytics-hub" element={<DashboardAnalyticsHub />} />
    <Route path="upgrade" element={<DashboardUpgrade />} />
    <Route path="payment-confirmation" element={<DashboardPaymentConfirmation />} />
    <Route path="settings" element={<DashboardSettings />} />
    <Route path="notifications" element={<DashboardNotifications />} />
    <Route path="business-page" element={<DashboardBusinessPage />} />
    <Route path="subscribers" element={<DashboardSubscribers />} />
  </>
);

export default dashboardRoutes;
