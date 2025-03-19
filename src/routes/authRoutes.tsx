
import { lazy } from "react";
import { RouteObject, Navigate } from "react-router-dom";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const VerificationPage = lazy(() => import("@/pages/auth/VerificationPage"));
const PlanSelectionPage = lazy(() => import("@/pages/auth/PlanSelectionPage"));
const WelcomeSetupPage = lazy(() => import("@/pages/auth/WelcomeSetupPage"));
const StaffInvitationPage = lazy(() => import("@/pages/auth/StaffInvitationPage"));

export const authRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <RegisterPage />,
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "verify",
    element: <VerificationPage />,
  },
  {
    path: "plan-selection",
    element: <PlanSelectionPage />,
  },
  {
    path: "welcome-setup",
    element: <WelcomeSetupPage />,
  },
  {
    path: "staff-invitation",
    element: <StaffInvitationPage />,
  },
];
