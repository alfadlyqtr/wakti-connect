
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { dashboardRoutes } from "./routes/dashboardRoutes";
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
import NotificationListener from "@/components/notifications/NotificationListener";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export const router = createBrowserRouter([
  // Public routes wrapped in PublicLayout
  {
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
  
  // Booking routes - kept completely separate from business routes
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
  
  // Business routes - completely separate path
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
  
  // Auth routes  
  {
    path: "/auth",
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
    children: authRoutes,
  },
  
  // Dashboard routes
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
              <SuperAdminLayout />
            </TaskProvider>
          </TooltipProvider>
        </ErrorBoundary>
      </SuperAdminGuard>
    ),
    children: superadminRoutes,
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
