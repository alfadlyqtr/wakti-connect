
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Use dynamic imports for better code splitting
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const DashboardTasks = lazy(() => import("@/pages/dashboard/DashboardTasks"));
const DashboardEvents = lazy(() => import("@/pages/dashboard/DashboardEvents"));
const DashboardServiceManagement = lazy(() => import("@/pages/dashboard/DashboardServiceManagement"));
const DashboardStaffManagement = lazy(() => import("@/pages/dashboard/DashboardStaffManagement"));
const DashboardBookings = lazy(() => import("@/pages/dashboard/DashboardBookings"));
const DashboardTeamManagement = lazy(() => import("@/pages/dashboard/DashboardTeamManagement"));
const DashboardWorkManagement = lazy(() => import("@/pages/dashboard/DashboardWorkManagement"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/DashboardSettings"));
const DashboardAnalytics = lazy(() => import("@/pages/dashboard/DashboardAnalytics"));
const DashboardMessaging = lazy(() => import("@/pages/dashboard/DashboardMessaging"));
const DashboardAI = lazy(() => import("@/pages/dashboard/DashboardAI"));
const DashboardLandingPage = lazy(() => import("@/pages/dashboard/DashboardLandingPage"));

// Wrap dynamic imports with suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: withSuspense(DashboardPage),
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
    element: withSuspense(DashboardAnalytics),
  },
  {
    path: "messaging",
    element: withSuspense(DashboardMessaging),
  },
  {
    path: "ai",
    element: withSuspense(DashboardAI),
  },
  {
    path: "landing-page",
    element: withSuspense(DashboardLandingPage),
  },
];
