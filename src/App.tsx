
import React, { Suspense } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout, DashboardLayout, AuthLayout } from "@/components/layout";
import SuspenseFallback from '@/components/common/SuspenseFallback';
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from '@/components/providers/AuthProvider';

// Auth Pages
const Login = React.lazy(() => import('@/pages/auth/Login'));
const Signup = React.lazy(() => import('@/pages/auth/Signup'));
const ForgotPassword = React.lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('@/pages/auth/ResetPassword'));
const VerifyEmail = React.lazy(() => import('@/pages/auth/VerifyEmail'));

// Dashboard Pages
const DashboardHome = React.lazy(() => import('@/pages/dashboard/DashboardHome'));
const DashboardTasks = React.lazy(() => import('@/pages/dashboard/DashboardTasks'));
const DashboardEvents = React.lazy(() => import('@/pages/dashboard/DashboardEvents'));
const DashboardMessages = React.lazy(() => import('@/pages/dashboard/DashboardMessages'));
const DashboardSettings = React.lazy(() => import('@/pages/dashboard/DashboardSettings'));
const DashboardAIAssistant = React.lazy(() => import('@/pages/dashboard/DashboardAIAssistant'));
const DashboardBusinessPage = React.lazy(() => import('@/pages/dashboard/DashboardBusinessPage'));
const DashboardServices = React.lazy(() => import('@/pages/dashboard/DashboardServices'));
const DashboardBookings = React.lazy(() => import('@/pages/dashboard/DashboardBookings'));
const DashboardJobs = React.lazy(() => import('@/pages/dashboard/DashboardJobs'));
const DashboardAnalytics = React.lazy(() => import('@/pages/dashboard/DashboardAnalytics'));
const DashboardReports = React.lazy(() => import('@/pages/dashboard/DashboardReports'));
const DashboardHelp = React.lazy(() => import('@/pages/dashboard/DashboardHelp'));

// Marketing Pages
const HomePage = React.lazy(() => import('@/pages/home/HomePage'));
const AboutPage = React.lazy(() => import('@/pages/about/AboutPage'));
const PricingPage = React.lazy(() => import('@/pages/pricing/PricingPage'));
const ContactPage = React.lazy(() => import('@/pages/contact/ContactPage'));

// Error Pages
const PageNotFound = React.lazy(() => import('@/pages/errors/PageNotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'verify-email', element: <VerifyEmail /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'tasks', element: <DashboardTasks /> },
      { path: 'events', element: <DashboardEvents /> },
      { path: 'bookings', element: <DashboardBookings /> },
      { path: 'messages', element: <DashboardMessages /> },
      { path: 'ai-assistant', element: <DashboardAIAssistant /> },
      { path: 'business-page', element: <DashboardBusinessPage /> },
      { path: 'services', element: <DashboardServices /> },
      { path: 'jobs', element: <DashboardJobs /> },
      { path: 'analytics', element: <DashboardAnalytics /> },
      { path: 'reports', element: <DashboardReports /> },
      { path: 'settings', element: <DashboardSettings /> },
      { path: 'help', element: <DashboardHelp /> },
    ],
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="wakti-theme">
      <AuthProvider>
        <Suspense fallback={<SuspenseFallback />}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
