
import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { authRoutes, publicRoutes, businessRoutes, bookingRoutes, superadminRoutes } from "./routes";
import SharedEventPage from '@/pages/SharedEventPage';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { dashboardRoutes } from "./routes/dashboardRoutes";

// Create the router with all the routes
export const router = createBrowserRouter([
  // Public routes (landing pages, auth, etc.)
  {
    path: "/",
    children: publicRoutes,
  },
  // Auth routes
  {
    path: "/auth/*",
    children: authRoutes,
  },
  // Dashboard routes
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      ...dashboardRoutes,
    ],
  },
  // Event sharing routes
  {
    path: "/e/:id",
    element: <SharedEventPage />,
  },
  {
    path: "/i/:id",
    element: <SharedEventPage />,
  },
  // Booking routes
  {
    path: "/book/*",
    children: bookingRoutes,
  },
  // Business routes
  {
    path: "/business/*",
    children: businessRoutes,
  },
  // Super admin routes
  {
    path: "/gohabsgo/*",
    children: superadminRoutes,
  }
]);
