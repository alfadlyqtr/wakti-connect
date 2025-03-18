
import React from 'react';
import { Route } from 'react-router-dom';

// Dashboard Pages
import DashboardHome from '@/pages/dashboard/DashboardHome';
import DashboardTasks from '@/pages/dashboard/DashboardTasks';
import DashboardSettings from '@/pages/dashboard/DashboardSettings';
import DashboardUpgrade from '@/pages/dashboard/DashboardUpgrade';
import DashboardMessages from '@/pages/dashboard/DashboardMessages';
import DashboardContacts from '@/pages/dashboard/DashboardContacts';
import DashboardProfile from '@/pages/dashboard/DashboardProfile';
import DashboardNotifications from '@/pages/dashboard/DashboardNotifications';
import DashboardBusinessPage from '@/pages/dashboard/DashboardBusinessPage';
import DashboardServiceManagement from '@/pages/dashboard/DashboardServiceManagement';
import DashboardBookings from '@/pages/dashboard/DashboardBookings';
import DashboardStaffManagement from '@/pages/dashboard/DashboardStaffManagement';
import DashboardWorkLogs from '@/pages/dashboard/DashboardWorkLogs';
import DashboardEvents from '@/pages/dashboard/DashboardEvents';
import DashboardSubscribers from '@/pages/dashboard/DashboardSubscribers';
import DashboardJobs from '@/pages/dashboard/DashboardJobs';
import DashboardJobCards from '@/pages/dashboard/DashboardJobCards';
import DashboardBilling from '@/pages/dashboard/DashboardBilling';
import DashboardBusinessAnalytics from '@/pages/dashboard/DashboardBusinessAnalytics';
import DashboardBusinessReports from '@/pages/dashboard/DashboardBusinessReports';
import DashboardPaymentConfirmation from '@/pages/dashboard/DashboardPaymentConfirmation';

export const dashboardRoutes = (
  <>
    <Route index element={<DashboardHome />} />
    <Route path="tasks" element={<DashboardTasks />} />
    <Route path="events" element={<DashboardEvents />} />
    <Route path="settings" element={<DashboardSettings />} />
    <Route path="upgrade" element={<DashboardUpgrade />} />
    <Route path="messages" element={<DashboardMessages />} />
    <Route path="contacts" element={<DashboardContacts />} />
    <Route path="profile" element={<DashboardProfile />} />
    <Route path="notifications" element={<DashboardNotifications />} />
    <Route path="business-page" element={<DashboardBusinessPage />} />
    <Route path="services" element={<DashboardServiceManagement />} />
    <Route path="bookings" element={<DashboardBookings />} />
    <Route path="staff" element={<DashboardStaffManagement />} />
    <Route path="work-logs" element={<DashboardWorkLogs />} />
    <Route path="subscribers" element={<DashboardSubscribers />} />
    <Route path="jobs" element={<DashboardJobs />} />
    <Route path="jobs/cards" element={<DashboardJobCards />} />
    <Route path="billing" element={<DashboardBilling />} />
    <Route path="analytics" element={<DashboardBusinessAnalytics />} />
    <Route path="reports" element={<DashboardBusinessReports />} />
    <Route path="payment/success" element={<DashboardPaymentConfirmation />} />
  </>
);
