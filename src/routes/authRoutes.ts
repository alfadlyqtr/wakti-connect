
import { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "@/pages/auth/LoginPage";
import Register from "@/pages/auth/RegisterPage";
import ForgotPassword from "@/pages/auth/ForgotPasswordPage";
import ResetPassword from "@/pages/auth/ResetPasswordPage";
import EmailVerification from "@/pages/auth/VerificationPage";
import VerifySuccess from "@/pages/auth/VerifySuccessPage";
import PlanSelection from "@/pages/auth/PlanSelectionPage";
import WelcomeSetup from "@/pages/auth/WelcomeSetupPage";
import PaymentSuccess from "@/pages/auth/PaymentSuccessPage";

export const authRoutes: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
  {
    path: "verify-email",
    element: <EmailVerification />,
  },
  {
    path: "verify-success",
    element: <VerifySuccess />,
  },
  {
    path: "plans",
    element: <PlanSelection />,
  },
  {
    path: "welcome-setup",
    element: <WelcomeSetup />,
  },
  {
    path: "payment-success",
    element: <PaymentSuccess />,
  },
];

