
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";
import NotFound from "@/pages/NotFound";
import AuthShell from "@/components/auth/AuthShell";
import DashboardShell from "@/components/dashboard/DashboardShell";
import BusinessShell from "@/components/business/BusinessShell";
import { publicRoutes } from "@/routes/publicRoutes";
import { authRoutes } from "@/routes/authRoutes";
import dashboardRoutes from "@/routes/dashboardRoutes";
import { businessRoutes } from "@/routes/businessRoutes";

export const router = createBrowserRouter([
  // Public routes
  ...publicRoutes,
  
  // Auth routes
  {
    path: "/auth",
    element: (
      <AuthShell>
        <Suspense fallback={<div>Loading...</div>} />
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
          <Suspense fallback={<div>Loading dashboard...</div>} />
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
        <Suspense fallback={<div>Loading business...</div>} />
      </BusinessShell>
    ),
    children: businessRoutes,
  },

  // 404 route
  {
    path: "*",
    element: <NotFound />,
  },
]);

