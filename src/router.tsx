
import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { authRoutes } from "./routes/authRoutes";
import { superadminRoutes } from "./routes/superadminRoutes";
import { bookingRoutes } from "./routes/businessRoutes";
import SharedEventPage from '@/pages/SharedEventPage';
import NotFoundPage from '@/pages/NotFound';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { dashboardRoutes } from "./routes/dashboardRoutes";

// Create the router with all our routes
const router = createBrowserRouter([
  {
    path: "/",
    children: publicRoutes,
  },
  {
    path: "/auth",
    children: authRoutes,
  },
  {
    path: "/superadmin",
    children: superadminRoutes,
  },
  {
    path: "/booking",
    children: bookingRoutes,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: dashboardRoutes,
  },
  {
    path: "/e/:id",
    element: <SharedEventPage />,
  },
  {
    path: "/i/:id",
    element: <SharedEventPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
