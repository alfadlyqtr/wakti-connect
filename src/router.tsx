
import { createBrowserRouter } from "react-router-dom";
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
    element: <AuthShell />,
    children: authRoutes,
  },

  // Dashboard routes
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardShell />
      </ProtectedRoute>
    ),
    children: dashboardRoutes,
  },

  // Business routes
  {
    path: "/business/:businessId",
    element: <BusinessShell />,
    children: businessRoutes,
  },

  // 404 route
  {
    path: "*",
    element: <NotFound />,
  },
]);
