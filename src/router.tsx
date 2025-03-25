
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
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export const router = createBrowserRouter([
  // Public routes with layout
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: publicRoutes,
  },
  
  // Auth routes
  {
    path: "/auth",
    element: (
      <AuthShell>
        <Suspense fallback={<LoadingSpinner />} />
      </AuthShell>
    ),
    errorElement: <ErrorBoundary />,
    children: authRoutes,
  },

  // Dashboard routes
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <ErrorBoundary>
          <DashboardShell>
            <Suspense fallback={<LoadingSpinner />} />
          </DashboardShell>
        </ErrorBoundary>
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: dashboardRoutes,
  },

  // Business routes
  {
    path: "/business/:businessId",
    element: (
      <ErrorBoundary>
        <BusinessShell>
          <Suspense fallback={<LoadingSpinner />} />
        </BusinessShell>
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary />,
    children: businessRoutes,
  },

  // 404 route
  {
    path: "*",
    element: <NotFound />,
  },
]);
