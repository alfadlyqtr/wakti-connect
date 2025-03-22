
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

export const authRoutes: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="/auth/login" replace />
  },
  {
    path: "login",
    element: <LoginPage />
  },
  {
    path: "register",
    element: <RegisterPage />
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />
  },
  {
    path: "reset-password",
    element: <ResetPasswordPage />
  },
  {
    path: "verify-email",
    element: <EmailVerification />
  },
  {
    path: "verify-success",
    element: <VerifySuccess />
  },
  {
    path: "plans",
    element: <PlanSelection />
  },
  {
    path: "welcome-setup",
    element: <WelcomeSetup />
  },
  {
    path: "payment-success",
    element: <PaymentSuccess />
  }
];

export default authRoutes;
