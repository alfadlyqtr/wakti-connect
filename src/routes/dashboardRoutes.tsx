
import { lazy } from "react";
import { RouteObject, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardTasks = lazy(() => import("@/pages/dashboard/DashboardTasks"));
const DashboardBookings = lazy(() => import("@/pages/dashboard/DashboardBookings"));
const DashboardEvents = lazy(() => import("@/pages/dashboard/DashboardEvents"));
const DashboardMessages = lazy(() => import("@/pages/dashboard/DashboardMessages"));
const DashboardContacts = lazy(() => import("@/pages/dashboard/DashboardContacts"));
const DashboardTeamManagement = lazy(() => import("@/pages/dashboard/DashboardTeamManagement"));
const DashboardServiceManagement = lazy(() => import("@/pages/dashboard/DashboardServiceManagement"));
const DashboardBusinessPage = lazy(() => import("@/pages/dashboard/DashboardBusinessPage"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/DashboardSettings"));
const DashboardProfile = lazy(() => import("@/pages/dashboard/DashboardProfile"));
const DashboardSubscribers = lazy(() => import("@/pages/dashboard/DashboardSubscribers"));
const DashboardNotifications = lazy(() => import("@/pages/dashboard/DashboardNotifications"));

export const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: <DashboardHome />,
  },
  {
    path: "tasks",
    element: (
      <ProtectedRoute requiredRole="free">
        <DashboardTasks />
      </ProtectedRoute>
    ),
  },
  {
    path: "bookings",
    element: (
      <ProtectedRoute requiredRole="free">
        <DashboardBookings />
      </ProtectedRoute>
    ),
  },
  {
    path: "events",
    element: (
      <ProtectedRoute requiredRole="free">
        <DashboardEvents />
      </ProtectedRoute>
    ),
  },
  {
    path: "messages",
    element: (
      <ProtectedRoute requiredRole="free">
        <DashboardMessages />
      </ProtectedRoute>
    ),
  },
  {
    path: "contacts",
    element: (
      <ProtectedRoute requiredRole="free">
        <DashboardContacts />
      </ProtectedRoute>
    ),
  },
  {
    path: "team",
    element: (
      <ProtectedRoute requiredRole="business">
        <DashboardTeamManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "services",
    element: (
      <ProtectedRoute requiredRole="business">
        <DashboardServiceManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "business-page",
    element: (
      <ProtectedRoute requiredRole="business">
        <DashboardBusinessPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "subscribers",
    element: (
      <ProtectedRoute requiredRole="business">
        <DashboardSubscribers />
      </ProtectedRoute>
    ),
  },
  {
    path: "settings",
    element: (
      <ProtectedRoute requiredRole="free">
        <DashboardSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: "profile",
    element: (
      <ProtectedRoute requiredRole="free">
        <DashboardProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "notifications",
    element: (
      <ProtectedRoute requiredRole="free">
        <DashboardNotifications />
      </ProtectedRoute>
    ),
  },
];
