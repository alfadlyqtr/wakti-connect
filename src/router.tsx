
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/auth/LoginPage";
import SignUp from "./pages/auth/RegisterPage";
import ForgotPassword from './pages/auth/ForgotPasswordPage';
import ResetPassword from './pages/auth/ResetPasswordPage';
import VerifyEmail from './pages/auth/VerificationPage';
import ContactForm from './components/contact/ContactForm';
import LandingPage from './pages/public/LandingPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardMessages from './pages/dashboard/DashboardMessages';
import DashboardTasks from './pages/dashboard/DashboardTasks';
import DashboardAIAssistant from './pages/dashboard/DashboardAIAssistant';
import DashboardProfile from './pages/dashboard/DashboardProfile';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import PrivacyPolicy from './pages/public/PrivacyPage';
import TermsOfService from './pages/public/TermsPage';
import AboutPage from './pages/public/AboutPage';
import PricingPage from './pages/public/PricingPage';
import FeaturesPage from './pages/public/FeaturesPage';
import SupportPage from './pages/public/ContactPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';
import { UnifiedChatInterfaceWithProvider } from "./components/ai/chat/UnifiedChatInterface";
import { MobileUXDemo } from "./components/mobile-demos/MobileUXDemo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "signin", element: <LoginPage /> },
      { path: "signup", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "contact", element: <ContactForm /> },
      { path: "about", element: <AboutPage /> },
      { path: "pricing", element: <PricingPage /> },
      { path: "features", element: <FeaturesPage /> },
      { path: "support", element: <SupportPage /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms-of-service", element: <TermsOfService /> },
      { path: "ai-chat", element: <UnifiedChatInterfaceWithProvider /> },
      { path: "mobile-demos", element: <MobileUXDemo /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "messages", element: <DashboardMessages /> },
          { path: "tasks", element: <DashboardTasks /> },
          { path: "ai-assistant", element: <DashboardAIAssistant /> },
          { path: "profile", element: <DashboardProfile /> },
          { path: "settings", element: <DashboardSettings /> },
          {
            path: "business",
            element: <RoleGuard allowedRoles={['super-admin']}><div>Business Settings</div></RoleGuard>
          },
          {
            path: "job-types",
            element: <RoleGuard allowedRoles={['super-admin']}><div>Job Types</div></RoleGuard>
          },
          {
            path: "staff",
            element: <RoleGuard allowedRoles={['super-admin']}><div>Staff Management</div></RoleGuard>
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

