
import React from 'react';
import { Route } from 'react-router-dom';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import DashboardTasks from '@/pages/dashboard/DashboardTasks';
import DashboardAppointments from '@/pages/dashboard/DashboardAppointments';
import DashboardMessages from '@/pages/dashboard/DashboardMessages';
import DashboardContacts from '@/pages/dashboard/DashboardContacts';
import DashboardJobCards from '@/pages/dashboard/DashboardJobCards';
import DashboardJobs from '@/pages/dashboard/DashboardJobs';
import DashboardWorkLogs from '@/pages/dashboard/DashboardWorkLogs';
import DashboardBusinessAnalytics from '@/pages/dashboard/DashboardBusinessAnalytics';
import DashboardBusinessReports from '@/pages/dashboard/DashboardBusinessReports';
import DashboardStaffManagement from '@/pages/dashboard/DashboardStaffManagement';
import DashboardServiceManagement from '@/pages/dashboard/DashboardServiceManagement';
import DashboardUpgrade from '@/pages/dashboard/DashboardUpgrade';
import DashboardBilling from '@/pages/dashboard/DashboardBilling';
import DashboardPaymentConfirmation from '@/pages/dashboard/DashboardPaymentConfirmation';
import DashboardProfile from '@/pages/dashboard/DashboardProfile';
import DashboardSettings from '@/pages/dashboard/DashboardSettings';
import DashboardNotifications from '@/pages/dashboard/DashboardNotifications';
import DashboardBusinessPage from '@/pages/dashboard/DashboardBusinessPage';
import DashboardSubscribers from '@/pages/dashboard/DashboardSubscribers';

const dashboardRoutes = (
  <>
    <Route path="" element={<DashboardHome />} />
    <Route path="tasks" element={<DashboardTasks />} />
    <Route path="appointments" element={<DashboardAppointments />} />
    <Route path="messages" element={<DashboardMessages />} />
    <Route path="contacts" element={<DashboardContacts />} />
    <Route path="jobs" element={<DashboardJobs />} />
    <Route path="job-cards" element={<DashboardJobCards />} />
    <Route path="work-logs" element={<DashboardWorkLogs />} />
    <Route path="analytics" element={<DashboardBusinessAnalytics />} />
    <Route path="reports" element={<DashboardBusinessReports />} />
    <Route path="staff" element={<DashboardStaffManagement />} />
    <Route path="services" element={<DashboardServiceManagement />} />
    <Route path="upgrade" element={<DashboardUpgrade />} />
    <Route path="billing" element={<DashboardBilling />} />
    <Route path="payment-confirmation" element={<DashboardPaymentConfirmation />} />
    <Route path="profile" element={<DashboardProfile />} />
    <Route path="settings" element={<DashboardSettings />} />
    <Route path="notifications" element={<DashboardNotifications />} />
    <Route path="business-page" element={<DashboardBusinessPage />} />
    <Route path="subscribers" element={<DashboardSubscribers />} />
  </>
);

export default dashboardRoutes;
