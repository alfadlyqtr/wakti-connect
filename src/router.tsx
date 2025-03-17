
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import NotFound from "@/pages/NotFound";

// For now, let's create a simple placeholder component for any missing components
const PlaceholderComponent = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-2xl font-bold mb-4">Component Placeholder</h1>
    <p className="text-muted-foreground mb-8">
      The component <code className="bg-muted p-1 rounded">{name}</code> is not yet implemented.
    </p>
    <p>This is a temporary placeholder while you build out the application.</p>
  </div>
);

// Dashboard related placeholders
const DashboardShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-primary text-primary-foreground p-4">
      <h1 className="text-xl font-bold">WAKTI Dashboard</h1>
    </header>
    <main className="flex-1 p-4">{children}</main>
  </div>
);

const DashboardHome = () => <PlaceholderComponent name="DashboardHome" />;
const DashboardTasks = () => <PlaceholderComponent name="DashboardTasks" />;
const DashboardSettings = () => <PlaceholderComponent name="DashboardSettings" />;

// Auth related placeholders
const AuthShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-muted/20">
    <div className="w-full max-w-md p-6 bg-card shadow-lg rounded-lg">{children}</div>
  </div>
);

const Login = () => <PlaceholderComponent name="Login" />;
const Register = () => <PlaceholderComponent name="Register" />;
const ForgotPassword = () => <PlaceholderComponent name="ForgotPassword" />;
const ResetPassword = () => <PlaceholderComponent name="ResetPassword" />;
const EmailVerification = () => <PlaceholderComponent name="EmailVerification" />;
const VerifySuccess = () => <PlaceholderComponent name="VerifySuccess" />;
const PlanSelection = () => <PlaceholderComponent name="PlanSelection" />;
const WelcomeSetup = () => <PlaceholderComponent name="WelcomeSetup" />;
const PaymentSuccess = () => <PlaceholderComponent name="PaymentSuccess" />;

// Business related placeholders
const BusinessShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-primary text-primary-foreground p-4">
      <h1 className="text-xl font-bold">WAKTI Business</h1>
    </header>
    <main className="flex-1 p-4">{children}</main>
  </div>
);

const BusinessPage = () => <PlaceholderComponent name="BusinessPage" />;
const DashboardBusinessPage = () => <PlaceholderComponent name="DashboardBusinessPage" />;
const DashboardUpgrade = () => <PlaceholderComponent name="DashboardUpgrade" />;
const DashboardTeamManagement = () => <PlaceholderComponent name="DashboardTeamManagement" />;
const DashboardWorkManagement = () => <PlaceholderComponent name="DashboardWorkManagement" />;
const DashboardAnalyticsHub = () => <PlaceholderComponent name="DashboardAnalyticsHub" />;
const DashboardServices = () => <PlaceholderComponent name="DashboardServices" />;
const TaskDetails = () => <PlaceholderComponent name="TaskDetails" />;

// Route protection placeholders
const PublicRoute = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const BusinessRoute = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Public pages placeholders
const LandingPage = () => <PlaceholderComponent name="LandingPage" />;
const FeaturesPage = () => <PlaceholderComponent name="FeaturesPage" />;
const PricingPage = () => <PlaceholderComponent name="PricingPage" />;
const ContactPage = () => <PlaceholderComponent name="ContactPage" />;

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
