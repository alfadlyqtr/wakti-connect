
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AuthLayout from "@/features/auth/components/AuthShell";
import { publicRoutes } from "./routes";
import { authRoutes } from "./routes";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { superadminRoutes } from "./routes";
import { businessRoutes } from "./routes";
import SlugResolver from "./components/business/SlugResolver";
import BusinessProfilePage from "./pages/BusinessProfilePage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <PublicLayout />,
        children: publicRoutes,
      },
      {
        path: "auth/*",
        element: <AuthLayout />,
        children: authRoutes,
      },
      {
        path: "dashboard/*",
        element: <DashboardLayout />,
        children: dashboardRoutes,
      },
      {
        path: "superadmin/*",
        children: superadminRoutes,
      },
      {
        path: "booking/*",
        children: businessRoutes,
      },
      {
        path: "b/:slug",
        element: <SlugResolver />
      },
      {
        path: "profile/:slug",
        element: <BusinessProfilePage />
      }
    ],
  },
]);
