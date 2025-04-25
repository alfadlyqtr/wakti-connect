
import React from "react";
import { createBrowserRouter, RouteObject, Outlet } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { authRoutes } from "./routes/authRoutes";
import { businessRoutes, bookingRoutes } from "./routes/businessRoutes";
import { superadminRoutes } from "./routes/superadminRoutes";
import NotFound from "./pages/NotFound";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SuperAdminGuard from "./components/auth/SuperAdminGuard";
import SuperAdminLayout from "./components/superadmin/SuperAdminLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ScrollToTop from "./components/ui/scroll-to-top";
import { TaskProvider } from "@/contexts/TaskContext";
import NotificationListener from "./components/notifications/NotificationListener";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { AuthProvider } from "@/features/auth";

// Lazy load dashboard pages
import { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Dashboard pages with lazy loading
const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardTasks = lazy(() => import("@/pages/dashboard/DashboardTasks"));
const DashboardEvents = lazy(() => import("@/pages/dashboard/DashboardEvents"));
const DashboardServiceManagement = lazy(() => import("@/pages/dashboard/DashboardServiceManagement"));
const DashboardStaffManagement = lazy(() => import("@/pages/dashboard/DashboardStaffManagement"));
const DashboardBookings = lazy(() => import("@/pages/dashboard/DashboardBookings"));
const DashboardMessages = lazy(() => import("@/pages/dashboard/DashboardMessages"));
const DashboardNotifications = lazy(() => import("@/pages/dashboard/DashboardNotifications"));
const DashboardAIAssistant = lazy(() => import("@/pages/dashboard/DashboardAIAssistant"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/DashboardSettings"));
const DashboardHelp = lazy(() => import("@/pages/dashboard/DashboardHelp"));
const DashboardContacts = lazy(() => import("@/pages/dashboard/DashboardContacts"));
const StaffDashboard = lazy(() => import("@/pages/dashboard/StaffDashboard"));
const DashboardJobs = lazy(() => import("@/pages/dashboard/DashboardJobs"));
const DashboardJobCards = lazy(() => import("@/pages/dashboard/DashboardJobCards"));
const DashboardMeetingSummary = lazy(() => import("@/pages/dashboard/MeetingSummary"));
const DashboardSubscribers = lazy(() => import("@/pages/dashboard/DashboardSubscribers"));

// Wrap components with Suspense for lazy loading
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

// Define dashboard routes
const dashboardRoutes: RouteObject[] = [
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
    path: "staff-dashboard",
    element: withSuspense(StaffDashboard),
  },
  {
    path: "bookings",
    element: withSuspense(DashboardBookings),
  },
  {
    path: "messages",
    element: withSuspense(DashboardMessages),
  },
  {
    path: "notifications",
    element: withSuspense(DashboardNotifications),
  },
  {
    path: "ai-assistant",
    element: withSuspense(DashboardAIAssistant),
  },
  {
    path: "settings",
    element: withSuspense(DashboardSettings),
  },
  {
    path: "help",
    element: withSuspense(DashboardHelp),
  },
  {
    path: "contacts",
    element: withSuspense(DashboardContacts),
  },
  {
    path: "jobs",
    element: withSuspense(DashboardJobs),
  },
  {
    path: "job-cards",
    element: withSuspense(DashboardJobCards),
  },
  {
    path: "meeting-summary",
    element: withSuspense(DashboardMeetingSummary),
  },
  {
    path: "subscribers",
    element: withSuspense(DashboardSubscribers),
  },
];

// Root wrapper component to provide auth context across all routes
const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Auth routes
      {
        path: "/auth",
        element: (
          <ErrorBoundary>
            <TooltipProvider>
              <ScrollToTop />
              <Toaster />
              <Sonner />
              <Outlet />
            </TooltipProvider>
          </ErrorBoundary>
        ),
        children: authRoutes,
      },
      
      // Public routes wrapped in PublicLayout
      {
        path: "/",
        element: (
          <ErrorBoundary>
            <TooltipProvider>
              <TaskProvider>
                <ScrollToTop />
                <NotificationListener />
                <Toaster />
                <Sonner />
                <PublicLayout />
              </TaskProvider>
            </TooltipProvider>
          </ErrorBoundary>
        ),
        children: publicRoutes,
      },
      
      // Booking routes
      {
        path: "/booking",
        element: (
          <ErrorBoundary>
            <TooltipProvider>
              <TaskProvider>
                <ScrollToTop />
                <NotificationListener />
                <Toaster />
                <Sonner />
              </TaskProvider>
            </TooltipProvider>
          </ErrorBoundary>
        ),
        children: bookingRoutes,
      },
      
      // Business routes
      {
        path: "/business",
        element: (
          <ErrorBoundary>
            <TooltipProvider>
              <TaskProvider>
                <ScrollToTop />
                <NotificationListener />
                <Toaster />
                <Sonner />
              </TaskProvider>
            </TooltipProvider>
          </ErrorBoundary>
        ),
        children: businessRoutes,
      },
      
      // Dashboard routes with role-based protection
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <ErrorBoundary>
              <TooltipProvider>
                <TaskProvider>
                  <ScrollToTop />
                  <NotificationListener />
                  <Toaster />
                  <Sonner />
                  <DashboardLayout />
                </TaskProvider>
              </TooltipProvider>
            </ErrorBoundary>
          </ProtectedRoute>
        ),
        children: dashboardRoutes,
      },
      
      // Super Admin Dashboard routes
      {
        path: "/gohabsgo",
        element: (
          <SuperAdminGuard>
            <ErrorBoundary>
              <TooltipProvider>
                <TaskProvider>
                  <ScrollToTop />
                  <NotificationListener />
                  <Toaster />
                  <Sonner />
                  <SuperAdminLayout>
                    <></>
                  </SuperAdminLayout>
                </TaskProvider>
              </TooltipProvider>
            </ErrorBoundary>
          </SuperAdminGuard>
        ),
        children: superadminRoutes as RouteObject[],
      },
      
      // 404 page
      {
        path: "*",
        element: (
          <ErrorBoundary>
            <TooltipProvider>
              <NotFound />
            </TooltipProvider>
          </ErrorBoundary>
        ),
      }
    ]
  },
]);
