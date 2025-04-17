import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { useAuth } from './hooks/useAuth';
import AuthLayout from './components/auth/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Tasks from './pages/dashboard/Tasks';
import Events from './pages/dashboard/Events';
import Bookings from './pages/dashboard/Bookings';
import Jobs from './pages/dashboard/Jobs';
import JobCards from './pages/dashboard/JobCards';
import Services from './pages/dashboard/Services';
import Staff from './pages/dashboard/Staff';
import BusinessPage from './pages/dashboard/BusinessPage';
import Analytics from './pages/dashboard/Analytics';
import Reports from './pages/dashboard/Reports';
import Settings from './pages/dashboard/Settings';
import Help from './pages/dashboard/Help';
import StaffCommunication from './pages/dashboard/StaffCommunication';
import Messages from './pages/dashboard/Messages';
import Subscribers from './pages/dashboard/Subscribers';
import AIAssistant from './pages/dashboard/DashboardAIAssistant';
import StaffDashboard from './pages/dashboard/StaffDashboard';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import UsersPage from './pages/superadmin/UsersPage';
import SecurityPage from './pages/superadmin/SecurityPage';
import BusinessesPage from './pages/superadmin/BusinessesPage';
import FinancialsPage from './pages/superadmin/FinancialsPage';
import ContentPage from './pages/superadmin/ContentPage';
import SystemPage from './pages/superadmin/SystemPage';
import ArchitecturePage from './pages/superadmin/ArchitecturePage';
import AnalyticsPage from './pages/superadmin/AnalyticsPage';
import AIControlPage from './pages/superadmin/AIControlPage';
import ExperimentsPage from './pages/superadmin/ExperimentsPage';
import CompliancePage from './pages/superadmin/CompliancePage';
import InboxPage from './pages/superadmin/InboxPage';
import DeveloperPage from './pages/superadmin/DeveloperPage';
import EmergencyPage from './pages/superadmin/EmergencyPage';
import VoiceTools from './pages/dashboard/VoiceTools';

const queryClient = new QueryClient();

// Define a function to check if the user is authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking authentication
  }

  if (!isAuthenticated) {
    // Redirect to login page with the current path as the "from" location
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

// Define a function to check if the user is a super admin
const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
  const location = useLocation();

  if (!isSuperAdmin) {
    // Redirect to login page with the current path as the "from" location
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

// Define dashboard routes
function DashboardRoutes() {
  return (
    <Routes>
      <Route 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<Tasks />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="events" element={<Events />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="job-cards" element={<JobCards />} />
        <Route path="services" element={<Services />} />
        <Route path="staff" element={<Staff />} />
        <Route path="business-page" element={<BusinessPage />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
        <Route path="staff-communication" element={<StaffCommunication />} />
        <Route path="messages" element={<Messages />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="staff-dashboard" element={<StaffDashboard />} />
        
        <Route path="voice-tools" element={<VoiceTools />} />
        
      </Route>
    </Routes>
  );
}

// Define super admin routes
function SuperAdminRoutes() {
  return (
    <Routes>
      <Route 
        element={
          <SuperAdminRoute>
            <DashboardLayout />
          </SuperAdminRoute>
        }
      >
        <Route path="" element={<SuperAdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="security" element={<SecurityPage />} />
        <Route path="businesses" element={<BusinessesPage />} />
        <Route path="financial" element={<FinancialsPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="system" element={<SystemPage />} />
        <Route path="architecture" element={<ArchitecturePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="ai-control" element={<AIControlPage />} />
        <Route path="experiments" element={<ExperimentsPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="developer" element={<DeveloperPage />} />
        <Route path="emergency" element={<EmergencyPage />} />
      </Route>
    </Routes>
  );
}

function AuthRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
}

function App() {
  const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
        <Router>
          <Routes>
            <Route path="/auth/*" element={<AuthRoutes />} />
            {isSuperAdmin ? (
              <Route path="/gohabsgo/*" element={<SuperAdminRoutes />} />
            ) : (
              <Route path="/dashboard/*" element={<DashboardRoutes />} />
            )}
            <Route path="*" element={<Navigate to={isSuperAdmin ? "/gohabsgo" : "/dashboard"} />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
