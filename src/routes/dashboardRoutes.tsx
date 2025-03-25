
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Use dynamic imports for better code splitting
const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardTasks = lazy(() => import("@/pages/dashboard/DashboardTasks"));
const DashboardEvents = lazy(() => import("@/pages/dashboard/DashboardEvents"));
const DashboardServiceManagement = lazy(() => import("@/pages/dashboard/DashboardServiceManagement"));
const DashboardStaffManagement = lazy(() => import("@/pages/dashboard/DashboardStaffManagement"));
const DashboardBookings = lazy(() => import("@/pages/dashboard/DashboardBookings"));
const DashboardTeamManagement = lazy(() => import("@/pages/dashboard/DashboardTeamManagement"));
const DashboardWorkManagement = lazy(() => import("@/pages/dashboard/DashboardWorkManagement"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/DashboardSettings"));
const DashboardBusinessAnalytics = lazy(() => import("@/pages/dashboard/DashboardBusinessAnalytics"));
const DashboardMessages = lazy(() => import("@/pages/dashboard/DashboardMessages"));
const DashboardAIAssistant = lazy(() => import("@/pages/dashboard/DashboardAIAssistant"));
const DashboardBusinessPage = lazy(() => import("@/pages/dashboard/DashboardBusinessPage"));

// Wrap dynamic imports with suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: withSuspense(DashboardHome),
  },
  {
    path: "tasks/*",
    element: withSuspense(DashboardTasks),
  },
  {
    path: "events",
    element: withSuspense(DashboardEvents),
  },
  {
    path: "services",
    element: withSuspense(DashboardServiceManagement),
  },
  {
    path: "staff",
    element: withSuspense(DashboardStaffManagement),
  },
  {
    path: "bookings",
    element: withSuspense(DashboardBookings),
  },
  {
    path: "team",
    element: withSuspense(DashboardTeamManagement),
  },
  {
    path: "work",
    element: withSuspense(DashboardWorkManagement),
  },
  {
    path: "settings",
    element: withSuspense(DashboardSettings),
  },
  {
    path: "analytics",
    element: withSuspense(DashboardBusinessAnalytics),
  },
  {
    path: "messaging",
    element: withSuspense(DashboardMessages),
  },
  {
    path: "ai",
    element: withSuspense(DashboardAIAssistant),
  },
  {
    path: "landing-page",
    element: withSuspense(DashboardBusinessPage),
  },
];
