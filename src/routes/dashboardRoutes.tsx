import React from "react";
import SuperAdminGuard from "@/components/auth/SuperAdminGuard";
import SuperAdminLayout from "@/components/superadmin/SuperAdminLayout";
import { superadminRoutes } from "./superadminRoutes";
import Dashboard from "@/pages/dashboard/Dashboard";
import Tasks from "@/pages/dashboard/Tasks";
import Settings from "@/pages/dashboard/Settings";
import Help from "@/pages/dashboard/Help";
import Events from "@/pages/dashboard/Events";
import Bookings from "@/pages/dashboard/Bookings";
import Jobs from "@/pages/dashboard/Jobs";
import Services from "@/pages/dashboard/Services";
import Staff from "@/pages/dashboard/Staff";
import BusinessPage from "@/pages/dashboard/BusinessPage";
import Analytics from "@/pages/dashboard/Analytics";
import Reports from "@/pages/dashboard/Reports";
import AIAssistant from "@/pages/dashboard/AIAssistant";
import Messages from "@/pages/dashboard/Messages";
import Subscribers from "@/pages/dashboard/Subscribers";
import JobCards from "@/pages/dashboard/JobCards";
import StaffCommunication from "@/pages/dashboard/StaffCommunication";

export const dashboardRoutes = [
  {
    path: "",
    element: <Dashboard />,
    index: true
  },
  {
    path: "tasks",
    element: <Tasks />
  },
  {
    path: "events",
    element: <Events />
  },
  {
    path: "bookings",
    element: <Bookings />
  },
  {
    path: "jobs",
    element: <Jobs />
  },
  {
    path: "job-cards",
    element: <JobCards />
  },
  {
    path: "services",
    element: <Services />
  },
  {
    path: "staff",
    element: <Staff />
  },
  {
    path: "business-page",
    element: <BusinessPage />
  },
  {
    path: "analytics",
    element: <Analytics />
  },
  {
    path: "reports",
    element: <Reports />
  },
  {
    path: "ai-assistant",
    element: <AIAssistant />
  },
  {
    path: "settings",
    element: <Settings />
  },
  {
    path: "help",
    element: <Help />
  },
  {
    path: "messages",
    element: <Messages />
  },
  {
    path: "subscribers",
    element: <Subscribers />
  },
  {
    path: "staff-communication",
    element: <StaffCommunication />
  }
];

// Super Admin routes - these are routed separately via App.tsx
// to the /gohabsgo/* path with SuperAdminGuard and SuperAdminLayout
