
import React from "react";
import { createBrowserRouter, RouteObject, Outlet } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { authRoutes } from "./routes/authRoutes";
import { businessRoutes, bookingRoutes } from "./routes/businessRoutes";
import { superadminRoutes } from "./routes/superadminRoutes";
import { dashboardRoutes as importedDashboardRoutes } from "./routes/dashboardRoutes";
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
import SharedEventPage from '@/pages/SharedEventPage';

// Lazy load dashboard pages
import { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Dashboard pages with lazy loading
const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardTasks = lazy(() => import("@/pages/dashboard/DashboardTasks"));
const DashboardCalendar = lazy(() => import("@/pages/dashboard/DashboardCalendarPage")); // Added Calendar page
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
const MessagesConversation = lazy(() => import("@/pages/dashboard/MessagesConversation"));

// Wrap components with Suspense for lazy loading
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

// Define dashboard routes
const localDashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: withSuspense(DashboardHome),
  },
  {
    path: "calendar", // New calendar route
    element: withSuspense(DashboardCalendar),
  },
  {
    path: "tasks/*",
    element: withSuspense(DashboardTasks),
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
    path: "messages/:userId",
    element: withSuspense(MessagesConversation),
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
];

// Combine dashboard routes from both sources
const combinedDashboardRoutes = [...localDashboardRoutes, ...importedDashboardRoutes];

export const router = createBrowserRouter([
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
    children: combinedDashboardRoutes,
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
  
  // Event shared page route
  {
    path: "/e/:id",
    element: (
      <ErrorBoundary>
        <TooltipProvider>
          <TaskProvider>
            <ScrollToTop />
            <Toaster />
            <Sonner />
            <SharedEventPage />
          </TaskProvider>
        </TooltipProvider>
      </ErrorBoundary>
    ),
  },
  
  // Invitation shared page route - make sure both formats are supported
  {
    path: "/i/:shareId",
    element: (
      <ErrorBoundary>
        <TooltipProvider>
          <TaskProvider>
            <ScrollToTop />
            <Toaster />
            <Sonner />
            <SharedEventPage />
          </TaskProvider>
        </TooltipProvider>
      </ErrorBoundary>
    ),
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
  },
]);
