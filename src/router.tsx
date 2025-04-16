
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { SignIn } from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import { ContactForm } from './components/ContactForm';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardMessages from './pages/dashboard/DashboardMessages';
import DashboardTasks from './pages/dashboard/DashboardTasks';
import DashboardAIAssistant from './pages/dashboard/DashboardAIAssistant';
import DashboardProfile from './pages/dashboard/DashboardProfile';
import DashboardBusinessSettings from './pages/dashboard/DashboardBusinessSettings';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import DashboardJobTypes from './pages/dashboard/DashboardJobTypes';
import DashboardStaff from './pages/dashboard/DashboardStaff';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import SupportPage from './pages/SupportPage';
import { NotFound } from './pages/NotFound';
import { RequireAuth } from './components/RequireAuth';
import { SuperAdminOnly } from './components/SuperAdminOnly';
import { UnifiedChatInterfaceWithProvider } from "./components/ai/chat/UnifiedChatInterface";
import { MobileUXDemo } from "./components/mobile-demos/MobileUXDemo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "signin", element: <SignIn /> },
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
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
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
            element: <SuperAdminOnly><DashboardBusinessSettings /></SuperAdminOnly>
          },
          {
            path: "job-types",
            element: <SuperAdminOnly><DashboardJobTypes /></SuperAdminOnly>
          },
          {
            path: "staff",
            element: <SuperAdminOnly><DashboardStaff /></SuperAdminOnly>
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
