
import React from "react";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardTasks from "@/pages/dashboard/DashboardTasks";
import DashboardEvents from "@/pages/dashboard/DashboardEvents";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import DashboardBusinessAnalytics from "@/pages/dashboard/DashboardBusinessAnalytics";
import DashboardStaffManagement from "@/pages/dashboard/DashboardStaffManagement";
import DashboardWorkLogs from "@/pages/dashboard/DashboardWorkLogs";
import DashboardTeamManagement from "@/pages/dashboard/DashboardTeamManagement";
import DashboardAIAssistant from "@/pages/dashboard/DashboardAIAssistant";

export const dashboardRoutes = [
  {
    path: "",
    element: <DashboardHome />,
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
    path: "team",
    element: <DashboardTeamManagement />,
  },
];
