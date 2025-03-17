import React from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/dashboard/Dashboard";
import DashboardContacts from "@/pages/dashboard/DashboardContacts";
import DashboardInvitations from "@/pages/dashboard/DashboardInvitations";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import BusinessDashboard from "@/pages/dashboard/BusinessDashboard";
import DashboardSubscribers from "@/pages/dashboard/DashboardSubscribers";
import DashboardUserSubscriptions from "@/pages/dashboard/DashboardUserSubscriptions";

const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "business",
        element: <BusinessDashboard />,
      },
      {
        path: "contacts",
        element: <DashboardContacts />,
      },
      {
        path: "invitations",
        element: <DashboardInvitations />,
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
    ],
  },
];

export default dashboardRoutes;
