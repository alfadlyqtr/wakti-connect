
import React from "react";
import { RouteObject } from "react-router-dom";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardContacts from "@/pages/dashboard/DashboardContacts";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import DashboardSubscribers from "@/pages/dashboard/DashboardSubscribers";
import DashboardUserSubscriptions from "@/pages/dashboard/DashboardUserSubscriptions";
import DashboardBusinessPage from "@/pages/dashboard/DashboardBusinessPage";
import DashboardMessages from "@/pages/dashboard/DashboardMessages";

const dashboardRoutes: RouteObject[] = [
  {
    path: "/",
    element: <DashboardHome />,
    index: true,
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
];

export default dashboardRoutes;
