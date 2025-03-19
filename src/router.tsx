
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";
import NotFound from "@/pages/NotFound";
import AuthShell from "@/components/auth/AuthShell";
import DashboardShell from "@/components/dashboard/DashboardShell";
import BusinessShell from "@/components/business/BusinessShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { publicRoutes } from "@/routes/publicRoutes";
import { authRoutes } from "@/routes/authRoutes";
import { dashboardRoutes } from "@/routes/dashboardRoutes";
import { businessRoutes } from "@/routes/businessRoutes";
import PublicLayout from "@/components/layout/PublicLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export const router = createBrowserRouter([
  // Public routes with layout
  {
    path: "/",
    element: <PublicLayout />,
    children: publicRoutes,
  },
  
  // Auth routes
  {
    path: "/auth",
    element: (
      <AuthShell>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        } />
      </AuthShell>
    ),
    children: authRoutes,
  },

  // Dashboard routes
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardShell>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner />
              <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
            </div>
          } />
        </DashboardShell>
      </ProtectedRoute>
    ),
    children: dashboardRoutes,
  },

  // Business routes
  {
    path: "/business/:businessId",
    element: (
      <BusinessShell>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
            <p className="mt-4 text-muted-foreground">Loading business...</p>
          </div>
        } />
      </BusinessShell>
    ),
    children: businessRoutes,
  },

  // Redirect /auth/login to /login
  {
    path: "/login",
    element: <Navigate to="/auth/login" replace />
  },

  // 404 route
  {
    path: "*",
    element: <NotFound />,
  },
]);
