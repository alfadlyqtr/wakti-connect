
import { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import EmailVerification from "@/pages/auth/VerificationPage";
import VerifySuccess from "@/pages/auth/VerifySuccessPage";
import PlanSelection from "@/pages/auth/PlanSelectionPage";
import WelcomeSetup from "@/pages/auth/WelcomeSetupPage";
import PaymentSuccess from "@/pages/auth/PaymentSuccessPage";
import AuthShell from "@/features/auth/components/AuthShell"; // Update to use from features

export const authRoutes: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="/auth/login" replace />
  },
  {
    path: "login",
    element: <AuthShell><LoginPage /></AuthShell>
  },
  {
    path: "register",
    element: <AuthShell><RegisterPage /></AuthShell>
  },
  {
    path: "forgot-password",
    element: <AuthShell><ForgotPasswordPage /></AuthShell>
  },
  {
    path: "reset-password",
    element: <AuthShell><ResetPasswordPage /></AuthShell>
  },
  {
    path: "verify-email",
    element: <AuthShell><EmailVerification /></AuthShell>
  },
  {
    path: "verify-success",
    element: <AuthShell><VerifySuccess /></AuthShell>
  },
  {
    path: "plans",
    element: <AuthShell><PlanSelection /></AuthShell>
  },
  {
    path: "welcome-setup",
    element: <AuthShell><WelcomeSetup /></AuthShell>
  },
  {
    path: "payment-success",
    element: <AuthShell><PaymentSuccess /></AuthShell>
  }
];

export default authRoutes;
