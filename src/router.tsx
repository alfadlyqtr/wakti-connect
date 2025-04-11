
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { authRoutes } from "./routes/authRoutes";
import { businessRoutes, bookingRoutes } from "./routes/businessRoutes";
import { superadminRoutes } from "./routes/superadminRoutes";
import SuperAdminGuard from "./components/auth/SuperAdminGuard";
import SuperAdminLayout from "./components/superadmin/SuperAdminLayout";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  // Booking routes - kept completely separate from business routes
  {
    path: "/booking",
    children: bookingRoutes,
  },
  
  // Business routes - completely separate path
  {
    path: "/business",
    children: businessRoutes,
  },
  
  // Super Admin routes - secured with SuperAdminGuard
  {
    path: "/gohabsgo",
    element: (
      <SuperAdminGuard>
        <SuperAdminLayout>
          <></>
        </SuperAdminLayout>
      </SuperAdminGuard>
    ),
    children: superadminRoutes,
  },
  
  // Auth routes  
  ...authRoutes,
  
  // Dashboard routes
  ...dashboardRoutes,
  
  // Public routes
  ...publicRoutes,
  
  // 404 page
  {
    path: "*",
    element: <NotFound />,
  },
]);

export const Router = () => <RouterProvider router={router} />;

export default Router;
