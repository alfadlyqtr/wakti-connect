
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Import the dashboard pages
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
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth redirect
    const handleOAuthRedirect = async () => {
      try {
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
            navigate(`/dashboard/${profileData.account_type}`);
          } else {
            // Default redirect if no profile
            navigate("/dashboard");
          }
        } else {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem processing your login. Please try again.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleOAuthRedirect();
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 mb-4">
          <div className="h-16 w-16 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Processing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we set up your account.</p>
      </div>
    </div>
  );
};

// Protected route component with improved loading state and error handling
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!data.session);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed in protected route:", event);
        setIsAuthenticated(!!session);
        
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </div>
    );
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
