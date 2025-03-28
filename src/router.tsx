
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { authRoutes } from "./routes/authRoutes";
import { businessRoutes, bookingRoutes } from "./routes/businessRoutes";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  // Booking routes - prioritized first to avoid conflicts
  ...bookingRoutes,
  
  // Business routes
  {
    path: "/business",
    children: businessRoutes,
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
