
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StaffRoleGuard from "@/components/auth/StaffRoleGuard";

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
const StaffDashboard = lazy(() => import("@/pages/dashboard/StaffDashboard"));
const DashboardJobs = lazy(() => import("@/pages/dashboard/DashboardJobs"));
const DashboardJobCards = lazy(() => import("@/pages/dashboard/DashboardJobCards"));

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
    element: (
      <StaffRoleGuard 
        disallowStaff={true}
        messageTitle="Tasks Not Available" 
        messageDescription="Task management is not available for staff accounts"
      >
        {withSuspense(DashboardTasks)}
      </StaffRoleGuard>
    ),
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
    path: "staff-dashboard",
    element: withSuspense(StaffDashboard),
  },
  {
    path: "bookings",
    element: withSuspense(DashboardBookings),
  },
  {
    path: "team",
    element: withSuspense(DashboardTeamManagement),
  },
  // Updated the work route to be accessible by staff - no StaffRoleGuard here
  {
    path: "work",
    element: withSuspense(DashboardWorkManagement),
  },
  // Added the jobs route accessible by staff - no StaffRoleGuard here
  {
    path: "jobs",
    element: withSuspense(DashboardJobs),
  },
  // Added the job-cards route accessible by staff - no StaffRoleGuard here
  {
    path: "job-cards",
    element: withSuspense(DashboardJobCards),
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
