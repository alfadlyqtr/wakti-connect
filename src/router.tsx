import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotificationListener from "@/components/notifications/NotificationListener";

// Lazy load pages for better performance
const LandingPage = lazy(() => import("@/pages/public/LandingPage"));
const FeaturesPage = lazy(() => import("@/pages/public/FeaturesPage"));
const PricingPage = lazy(() => import("@/pages/public/PricingPage"));
const ContactPage = lazy(() => import("@/pages/public/ContactPage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const PrivacyPage = lazy(() => import("@/pages/public/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/public/TermsPage"));
const FaqPage = lazy(() => import("@/pages/public/FaqPage"));

// Auth pages
const Login = lazy(() => import("@/components/auth/LoginForm"));
const Register = lazy(() => import("@/components/auth/SignupForm"));

// Correctly import auth components or create simpler placeholder versions
// We'll create simple placeholder components for now
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const EmailVerification = lazy(() => import("@/pages/auth/VerificationPage"));
const VerifySuccess = Login; // Use Login as a temporary placeholder
const PlanSelection = lazy(() => import("@/components/billing/PlanSelection"));
const WelcomeSetup = Login; // Use Login as a temporary placeholder
const PaymentSuccess = lazy(() => import("@/pages/dashboard/DashboardPaymentConfirmation"));

// Dashboard pages
const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardTasks = lazy(() => import("@/pages/dashboard/DashboardTasks"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/DashboardSettings"));
const DashboardBusinessPage = lazy(() => import("@/pages/dashboard/DashboardBusinessPage"));
const DashboardTeamManagement = lazy(() => import("@/pages/dashboard/DashboardTeamManagement"));
const DashboardWorkManagement = lazy(() => import("@/pages/dashboard/DashboardWorkManagement"));
const DashboardAnalyticsHub = lazy(() => import("@/pages/dashboard/DashboardAnalyticsHub"));
const DashboardBilling = lazy(() => import("@/pages/dashboard/DashboardBilling"));
const DashboardBookings = lazy(() => import("@/pages/dashboard/DashboardBookings"));
const DashboardServiceManagement = lazy(() => import("@/pages/dashboard/DashboardServiceManagement"));
const DashboardContacts = lazy(() => import("@/pages/dashboard/DashboardContacts"));
const DashboardMessages = lazy(() => import("@/pages/dashboard/DashboardMessages"));
const DashboardBusinessAnalytics = lazy(() => import("@/pages/dashboard/DashboardBusinessAnalytics"));
const DashboardBusinessReports = lazy(() => import("@/pages/dashboard/DashboardBusinessReports"));
const TaskDetails = lazy(() => import("@/components/tasks/TaskDetails"));

// Business pages
const BusinessLandingPage = lazy(() => import("@/components/business/landing/BusinessLandingPage"));

// Auth shell wrapper with error state
const AuthShell = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState("");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      {error && (
        <div className="absolute top-4 w-full max-w-md mx-auto">
          <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
            {error}
          </div>
        </div>
      )}
      <div className="w-full max-w-md p-6 bg-card shadow-lg rounded-lg">
        {React.isValidElement(children) 
          ? React.cloneElement(children, { setError } as any) 
          : children}
      </div>
    </div>
  );
};

// Business shell wrapper
const BusinessShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading business...</div>}>
      {children}
    </Suspense>
  </div>
);

// Business route protection
const BusinessRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requiredRole="business">
    {children}
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: "/features",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <FeaturesPage />
      </Suspense>
    ),
  },
  {
    path: "/pricing",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <PricingPage />
      </Suspense>
    ),
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <ContactPage />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <AboutPage />
      </Suspense>
    ),
  },
  {
    path: "/privacy",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <PrivacyPage />
      </Suspense>
    ),
  },
  {
    path: "/terms",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <TermsPage />
      </Suspense>
    ),
  },
  {
    path: "/faq",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <FaqPage />
      </Suspense>
    ),
  },
  {
    path: "/auth",
    element: (
      <AuthShell>
        <Suspense fallback={<div className="flex items-center justify-center h-20">Loading...</div>} />
      </AuthShell>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-20">Loading...</div>}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-20">Loading...</div>}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-20">Loading...</div>}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: "reset-password",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-20">Loading...</div>}>
            <ResetPassword />
          </Suspense>
        ),
      },
      {
        path: "verify-email",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-20">Loading...</div>}>
            <EmailVerification />
          </Suspense>
        ),
      },
      {
        path: "verify-success",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-20">Loading...</div>}>
            <VerifySuccess />
          </Suspense>
        ),
      },
      {
        path: "plans",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="flex items-center justify-center h-20">Loading...</div>}>
              <PlanSelection selectedPlan={null} setSelectedPlan={() => {}} />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "welcome-setup",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="flex items-center justify-center h-20">Loading...</div>}>
              <WelcomeSetup />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-success",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="flex items-center justify-center h-20">Loading...</div>}>
              <PaymentSuccess />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <NotificationListener />
        <DashboardLayout>
          <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-70px)]">Loading dashboard...</div>} />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
            <DashboardHome />
          </Suspense>
        ),
      },
      {
        path: "tasks",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
            <DashboardTasks />
          </Suspense>
        ),
      },
      {
        path: "tasks/:taskId",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
            <TaskDetails />
          </Suspense>
        ),
      },
      {
        path: "billing",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
            <DashboardBilling />
          </Suspense>
        ),
      },
      {
        path: "business-page",
        element: (
          <BusinessRoute>
            <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
              <DashboardBusinessPage />
            </Suspense>
          </BusinessRoute>
        ),
      },
      {
        path: "team-management",
        element: (
          <BusinessRoute>
            <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
              <DashboardTeamManagement />
            </Suspense>
          </BusinessRoute>
        ),
      },
      {
        path: "work-management",
        element: (
          <BusinessRoute>
            <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
              <DashboardWorkManagement />
            </Suspense>
          </BusinessRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <BusinessRoute>
            <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
              <DashboardAnalyticsHub />
            </Suspense>
          </BusinessRoute>
        ),
      },
      {
        path: "business-analytics",
        element: (
          <BusinessRoute>
            <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
              <DashboardBusinessAnalytics />
            </Suspense>
          </BusinessRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <BusinessRoute>
            <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
              <DashboardBusinessReports />
            </Suspense>
          </BusinessRoute>
        ),
      },
      {
        path: "services",
        element: (
          <BusinessRoute>
            <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
              <DashboardServiceManagement />
            </Suspense>
          </BusinessRoute>
        ),
      },
      {
        path: "bookings",
        element: (
          <BusinessRoute>
            <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
              <DashboardBookings />
            </Suspense>
          </BusinessRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
            <DashboardSettings />
          </Suspense>
        ),
      },
      {
        path: "contacts",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
            <DashboardContacts />
          </Suspense>
        ),
      },
      {
        path: "messages",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
            <DashboardMessages />
          </Suspense>
        ),
      },
      {
        path: "messages/:userId",
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-80">Loading...</div>}>
            <DashboardMessages />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/business/:businessId",
    element: (
      <BusinessShell>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading business...</div>}>
          <BusinessLandingPage />
        </Suspense>
      </BusinessShell>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
