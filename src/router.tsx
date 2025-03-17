
import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardTasks from "@/pages/dashboard/DashboardTasks";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import NotFound from "@/pages/NotFound";
import AuthShell from "@/components/layout/AuthShell";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import PublicRoute from "@/components/route/PublicRoute";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import BusinessPage from "@/pages/business/BusinessPage";
import BusinessShell from "@/components/layout/BusinessShell";
import PlanSelection from "@/pages/auth/PlanSelection";
import WelcomeSetup from "@/pages/auth/WelcomeSetup";
import PaymentSuccess from "@/pages/auth/PaymentSuccess";
import DashboardBusinessPage from "@/pages/dashboard/DashboardBusinessPage";
import LandingPage from "@/pages/public/LandingPage";
import ContactPage from "@/pages/public/ContactPage";
import FeaturesPage from "@/pages/public/FeaturesPage";
import PricingPage from "@/pages/public/PricingPage";
import DashboardUpgrade from "@/pages/dashboard/DashboardUpgrade";
import DashboardTeamManagement from "@/pages/dashboard/DashboardTeamManagement";
import DashboardWorkManagement from "@/pages/dashboard/DashboardWorkManagement";
import DashboardAnalyticsHub from "@/pages/dashboard/DashboardAnalyticsHub";
import DashboardServices from "@/pages/dashboard/DashboardServices";
import BusinessRoute from "@/components/route/BusinessRoute";
import EmailVerification from "@/pages/auth/EmailVerification";
import VerifySuccess from "@/pages/auth/VerifySuccess";
import TaskDetails from "@/components/tasks/TaskDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/features",
    element: <FeaturesPage />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/auth",
    element: <AuthShell />,
    children: [
      {
        path: "",
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ),
      },
      {
        path: "reset-password",
        element: (
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        ),
      },
      {
        path: "verify-email",
        element: (
          <PublicRoute>
            <EmailVerification />
          </PublicRoute>
        ),
      },
      {
        path: "verify-success",
        element: (
          <PublicRoute>
            <VerifySuccess />
          </PublicRoute>
        ),
      },
      {
        path: "plans",
        element: (
          <ProtectedRoute>
            <PlanSelection />
          </ProtectedRoute>
        ),
      },
      {
        path: "welcome-setup",
        element: (
          <ProtectedRoute>
            <WelcomeSetup />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-success",
        element: (
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardShell />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <DashboardHome />,
      },
      {
        path: "tasks",
        element: <DashboardTasks />,
      },
      {
        path: "tasks/:taskId",
        element: <TaskDetails />,
      },
      {
        path: "upgrade",
        element: <DashboardUpgrade />,
      },
      {
        path: "business-page",
        element: (
          <BusinessRoute>
            <DashboardBusinessPage />
          </BusinessRoute>
        ),
      },
      {
        path: "team-management",
        element: (
          <BusinessRoute>
            <DashboardTeamManagement />
          </BusinessRoute>
        ),
      },
      {
        path: "work-management",
        element: (
          <BusinessRoute>
            <DashboardWorkManagement />
          </BusinessRoute>
        ),
      },
      {
        path: "analytics-hub",
        element: (
          <BusinessRoute>
            <DashboardAnalyticsHub />
          </BusinessRoute>
        ),
      },
      {
        path: "services",
        element: (
          <BusinessRoute>
            <DashboardServices />
          </BusinessRoute>
        ),
      },
      {
        path: "settings",
        element: <DashboardSettings />,
      },
    ],
  },
  {
    path: "/business/:businessId",
    element: <BusinessShell />,
    children: [
      {
        path: "",
        element: <BusinessPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
