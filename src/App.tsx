
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

// Import the new dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardTasks from "./pages/dashboard/DashboardTasks";
import DashboardAppointments from "./pages/dashboard/DashboardAppointments";
import DashboardMessages from "./pages/dashboard/DashboardMessages";
import DashboardNotifications from "./pages/dashboard/DashboardNotifications";
import DashboardContacts from "./pages/dashboard/DashboardContacts";
import DashboardSettings from "./pages/dashboard/DashboardSettings";

const queryClient = new QueryClient();

// Auth callback handler for OAuth providers
const AuthCallback = () => {
  useEffect(() => {
    // Handle OAuth redirect
    const handleOAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      // Redirect to appropriate dashboard based on account type
      if (data?.session) {
        // Get user profile to check account type
        const { data: profileData } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', data.session.user.id)
          .single();
        
        if (profileData) {
          // Redirect based on account type
          window.location.href = `/dashboard/${profileData.account_type}`;
        } else {
          // Default redirect if no profile
          window.location.href = "/dashboard";
        }
      } else {
        window.location.href = "/auth";
      }
    };

    handleOAuthRedirect();
  }, []);

  return <div>Processing authentication...</div>;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setLoading(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Account type specific dashboard routes */}
          <Route path="/dashboard/free" element={
            <ProtectedRoute>
              <DashboardLayout userRole="free">
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/individual" element={
            <ProtectedRoute>
              <DashboardLayout userRole="individual">
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/business" element={
            <ProtectedRoute>
              <DashboardLayout userRole="business">
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Task routes */}
          <Route path="/tasks" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardTasks />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Appointments routes */}
          <Route path="/appointments" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardAppointments />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Messages routes */}
          <Route path="/messages" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardMessages />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Notifications routes */}
          <Route path="/notifications" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardNotifications />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Contacts routes */}
          <Route path="/contacts" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardContacts />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Settings routes */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardSettings />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

