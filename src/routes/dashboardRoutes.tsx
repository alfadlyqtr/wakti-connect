
import React from "react";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardTasks from "@/pages/dashboard/DashboardTasks";
import DashboardEvents from "@/pages/dashboard/DashboardEvents";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import DashboardBusinessAnalytics from "@/pages/dashboard/DashboardBusinessAnalytics";
import DashboardStaffManagement from "@/pages/dashboard/staff-management";
import DashboardWorkLogs from "@/pages/dashboard/DashboardWorkLogs";
import DashboardAIAssistant from "@/pages/dashboard/DashboardAIAssistant";
import DashboardMessages from "@/pages/dashboard/DashboardMessages";
import DashboardContacts from "@/pages/dashboard/DashboardContacts";
import DashboardSubscribers from "@/pages/dashboard/DashboardSubscribers";
import DashboardNotifications from "@/pages/dashboard/DashboardNotifications";
import DashboardWorkManagement from "@/pages/dashboard/DashboardWorkManagement";
import DashboardJobCards from "@/pages/dashboard/DashboardJobCards";
import StaffDashboard from "@/pages/dashboard/StaffDashboard";

export const dashboardRoutes = [
  {
    path: "",
    element: <DashboardHome />,
  },
  {
    path: "staff-dashboard",
    element: <StaffDashboard />,
  },
  {
    path: "tasks",
    element: <DashboardTasks />,
  },
  {
    path: "events",
    element: <DashboardEvents />,
  },
  {
    path: "ai-assistant",
    element: <DashboardAIAssistant />,
  },
  {
    path: "settings",
    element: <DashboardSettings />,
  },
  {
    path: "analytics",
    element: <DashboardBusinessAnalytics />,
  },
  {
    path: "staff",
    element: <DashboardStaffManagement />,
  },
  {
    path: "work-logs",
    element: <DashboardWorkLogs />,
  },
  {
    path: "work-management",
    element: <DashboardWorkManagement />,
  },
  {
    path: "job-cards",
    element: <DashboardJobCards />,
  },
  {
    path: "messages/*",
    element: <DashboardMessages />,
  },
  {
    path: "contacts",
    element: <DashboardContacts />,
  },
  {
    path: "subscribers",
    element: <DashboardSubscribers />,
  },
  {
    path: "notifications",
    element: <DashboardNotifications />,
  },
];
