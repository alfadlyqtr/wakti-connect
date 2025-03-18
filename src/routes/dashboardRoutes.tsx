
import React from 'react';
import { RouteObject } from 'react-router-dom';

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

export const dashboardRoutes: RouteObject[] = [
  { path: "", element: <DashboardHome /> },
  { path: "tasks", element: <DashboardTasks /> },
  { path: "events", element: <DashboardEvents /> },
  { path: "settings", element: <DashboardSettings /> },
  { path: "upgrade", element: <DashboardUpgrade /> },
  { path: "messages", element: <DashboardMessages /> },
  { path: "contacts", element: <DashboardContacts /> },
  { path: "profile", element: <DashboardProfile /> },
  { path: "notifications", element: <DashboardNotifications /> },
  { path: "business-page", element: <DashboardBusinessPage /> },
  { path: "services", element: <DashboardServiceManagement /> },
  { path: "bookings", element: <DashboardBookings /> },
  { path: "staff", element: <DashboardStaffManagement /> },
  { path: "work-logs", element: <DashboardWorkLogs /> },
  { path: "subscribers", element: <DashboardSubscribers /> },
  { path: "jobs", element: <DashboardJobs /> },
  { path: "jobs/cards", element: <DashboardJobCards /> },
  { path: "billing", element: <DashboardBilling /> },
  { path: "analytics", element: <DashboardBusinessAnalytics /> },
  { path: "reports", element: <DashboardBusinessReports /> },
  { path: "payment/success", element: <DashboardPaymentConfirmation /> }
];
