import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useBusinessData } from "./hooks/useBusinessData";
import { useProfile } from "./hooks/useProfile";
import { ScrollToTop } from "./utils/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";

// Import the pages
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import BusinessPage from "./pages/BusinessPage";
import ServicesPage from "./pages/ServicesPage";
import BookingsPage from "./pages/BookingsPage";
import TeamManagement from "./pages/TeamManagement";
import ContactsPage from "./pages/ContactsPage";
import InvitationsPage from "./pages/InvitationsPage";
import BusinessSettingsPage from "./pages/BusinessSettingsPage";
import BusinessBrandingPage from "./pages/BusinessBrandingPage";
import BusinessPageBuilder from "./pages/BusinessPageBuilder";
import DashboardTeamManagement from "./pages/dashboard/DashboardTeamManagement";
import StaffInvitationPage from "./pages/auth/StaffInvitationPage";

// Import the StaffInvitationPage

function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { business, isLoading: businessLoading } = useBusinessData();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if all necessary data has been loaded
    if (!authLoading && !profileLoading && !businessLoading) {
      setIsInitialized(true);
    }
  }, [authLoading, profileLoading, businessLoading]);

  // Show a loading indicator while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  // Define the PrivateRoute component
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? (
      children
    ) : (
      <Navigate to="/auth/login" replace />
    );
  };

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/business/:businessSlug" element={<BusinessPage />} />

          {/* Auth routes */}
          <Route path="/auth">
            <Route index element={<Navigate to="/auth/login" replace />} />
            <Route path="login" element={<AuthPage />} />
            <Route path="signup" element={<AuthPage mode="signup" />} />
            <Route path="staff-invitation" element={<StaffInvitationPage />} />
          </Route>

          {/* Private routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="services" replace />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="team" element={<DashboardTeamManagement />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="invitations" element={<InvitationsPage />} />
            <Route path="settings" element={<BusinessSettingsPage />} />
            <Route path="branding" element={<BusinessBrandingPage />} />
            <Route path="page-builder" element={<BusinessPageBuilder />} />
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
