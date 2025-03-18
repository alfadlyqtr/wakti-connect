
import React from "react";
import { RouteObject } from "react-router-dom";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardContacts from "@/pages/dashboard/DashboardContacts";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import DashboardSubscribers from "@/pages/dashboard/DashboardSubscribers";
import DashboardUserSubscriptions from "@/pages/dashboard/DashboardUserSubscriptions";
import DashboardBusinessPage from "@/pages/dashboard/DashboardBusinessPage";
import DashboardMessages from "@/pages/dashboard/DashboardMessages";
import DashboardNotifications from "@/pages/dashboard/DashboardNotifications";
import DashboardBookings from "@/pages/dashboard/DashboardBookings";
import DashboardTasks from "@/pages/dashboard/DashboardTasks";
import DashboardTeamManagement from "@/pages/dashboard/DashboardTeamManagement";
import DashboardWorkManagement from "@/pages/dashboard/DashboardWorkManagement";
import DashboardServiceManagement from "@/pages/dashboard/DashboardServiceManagement";
import TaskDetails from "@/components/tasks/TaskDetails";

const dashboardRoutes: RouteObject[] = [
  {
    path: "/",
    element: <DashboardHome />,
    index: true,
  },
  {
    path: "tasks",
    element: <DashboardTasks />,
  },
  {
    path: "tasks/:taskId",
    element: <TaskDetails />,
  },
  {
    path: "bookings",
    element: <DashboardBookings />,
  },
  {
    path: "team-management",
    element: <DashboardTeamManagement />,
  },
  {
    path: "staff",
    element: <DashboardTeamManagement />,
  },
  {
    path: "work-management",
    element: <DashboardWorkManagement />,
  },
  {
    path: "business-page",
    element: <DashboardBusinessPage />,
  },
  {
    path: "contacts",
    element: <DashboardContacts />,
  },
  {
    path: "settings",
    element: <DashboardSettings />,
  },
  {
    path: "subscribers",
    element: <DashboardSubscribers />,
  },
  {
    path: "subscriptions",
    element: <DashboardUserSubscriptions />,
  },
  {
    path: "messages",
    element: <DashboardMessages />,
  },
  {
    path: "messages/:userId",
    element: <DashboardMessages />,
  },
  {
    path: "notifications",
    element: <DashboardNotifications />,
  },
  {
    path: "services",
    element: <DashboardServiceManagement />,
  },
];

export default dashboardRoutes;
