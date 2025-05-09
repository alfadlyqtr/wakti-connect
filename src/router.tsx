
import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AuthShell from "@/features/auth/components/AuthShell";
import { publicRoutes } from "./routes";
import { authRoutes } from "./routes";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { superadminRoutes } from "./routes";
import { businessRoutes } from "./routes";
import SlugResolver from "./components/business/SlugResolver";
import BusinessProfilePage from "./pages/BusinessProfilePage";

// Root application layout that doesn't depend on App.tsx
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    element: <RootLayout>
      {/* Child routes will be automatically inserted here by react-router */}
    </RootLayout>,
    children: [
      {
        element: <PublicLayout />,
        children: publicRoutes,
      },
      {
        path: "auth/*",
        element: <AuthShell />,
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
