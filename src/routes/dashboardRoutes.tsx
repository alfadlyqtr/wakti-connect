
import React from "react";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardTasks from "@/pages/dashboard/DashboardTasks";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import DashboardHelp from "@/pages/dashboard/DashboardHelp";
import DashboardEvents from "@/pages/dashboard/DashboardEvents";
import DashboardBookings from "@/pages/dashboard/DashboardBookings";
import DashboardJobs from "@/pages/dashboard/DashboardJobs";
import DashboardServiceManagement from "@/pages/dashboard/DashboardServiceManagement";
import DashboardStaffManagement from "@/pages/dashboard/DashboardStaffManagement";
import DashboardBusinessPage from "@/pages/dashboard/DashboardBusinessPage";
import DashboardBusinessAnalytics from "@/pages/dashboard/DashboardBusinessAnalytics";
import DashboardBusinessReports from "@/pages/dashboard/DashboardBusinessReports";
import DashboardAIAssistant from "@/pages/dashboard/DashboardAIAssistant";
import DashboardMessages from "@/pages/dashboard/DashboardMessages";
import DashboardSubscribers from "@/pages/dashboard/DashboardSubscribers";
import DashboardJobCards from "@/pages/dashboard/DashboardJobCards";
import DashboardStaffCommunication from "@/pages/dashboard/DashboardStaffCommunication";

export const dashboardRoutes = [
  {
    path: "",
    element: <DashboardHome />,
    index: true
  },
  {
    path: "tasks",
    element: <DashboardTasks />
  },
  {
    path: "events",
    element: <DashboardEvents />
  },
  {
    path: "bookings",
    element: <DashboardBookings />
  },
  {
    path: "jobs",
    element: <DashboardJobs />
  },
  {
    path: "job-cards",
    element: <DashboardJobCards />
  },
  {
    path: "services",
    element: <DashboardServiceManagement />
  },
  {
    path: "staff",
    element: <DashboardStaffManagement />
  },
  {
    path: "business-page",
    element: <DashboardBusinessPage />
  },
  {
    path: "analytics",
    element: <DashboardBusinessAnalytics />
  },
  {
    path: "reports",
    element: <DashboardBusinessReports />
  },
  {
    path: "ai-assistant",
    element: <DashboardAIAssistant />
  },
  {
    path: "settings",
    element: <DashboardSettings />
  },
  {
    path: "help",
    element: <DashboardHelp />
  },
  {
    path: "messages",
    element: <DashboardMessages />
  },
  {
    path: "subscribers",
    element: <DashboardSubscribers />
  },
  {
    path: "staff-communication",
    element: <DashboardStaffCommunication />
  }
];

// Super Admin routes - these are routed separately via App.tsx
// to the /gohabsgo/* path with SuperAdminGuard and SuperAdminLayout
