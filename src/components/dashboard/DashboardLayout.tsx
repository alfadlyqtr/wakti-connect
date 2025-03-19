
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import "@/components/layout/sidebar/sidebar.css";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { ErrorBoundary } from "react-error-boundary";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "free" | "individual" | "business";
}

interface ProfileData {
  account_type: "free" | "individual" | "business";
  display_name: string | null;
  business_name: string | null;
  full_name: string | null;
  theme_preference: string | null;
}

const DashboardFallback = () => (
  <div className="flex flex-col items-center justify-center h-[70vh] p-4">
    <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
    <p className="text-muted-foreground mb-4 text-center">
      We encountered an issue loading the dashboard. This has been reported.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
    >
      Refresh Page
    </button>
  </div>
);

const DashboardLayout = ({ children, userRole: propUserRole }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [hasLoadingTimeout, setHasLoadingTimeout] = useState(false);

  // Set a timeout to prevent infinite loading state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasLoadingTimeout(true);
    }, 7000); // 7 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Fetch user profile data for the dashboard with minimal fields
  const { data: profileData, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['dashboardUserProfile'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session found, redirecting to auth page");
          navigate("/auth");
          return null;
        }
        
        // Use the new security definer function to get user role first
        const { data: userRoleData } = await supabase.rpc('get_user_role');
        
        // Then fetch only necessary profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, business_name, full_name, theme_preference')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user profile:", error);
          if (error.code === 'PGRST116') {
            console.log("Profile not found, user may need to sign up");
            navigate("/auth");
          }
          return null;
        }
        
        // Combine the data
        return {
          ...data,
          account_type: userRoleData || 'free'
        } as ProfileData;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
    },
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 300000, // 5 minutes
  });

  // Set theme based on user preference
  useEffect(() => {
    if (profileData?.theme_preference) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(profileData.theme_preference);
    }
  }, [profileData?.theme_preference]);

  // Setup auth listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in dashboard layout:", event);
      
      if (event === 'SIGNED_OUT') {
        // Clear stored user role on sign out
        localStorage.removeItem('userRole');
        navigate("/auth");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        const navbarToggle = document.getElementById('sidebar-toggle');
        
        if (sidebar && 
            !sidebar.contains(event.target as Node) && 
            navbarToggle && 
            !navbarToggle.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get the correct user role with a fallback mechanism
  const userRoleValue = profileData?.account_type || 
                        propUserRole || 
                        localStorage.getItem('userRole') as "free" | "individual" | "business" || 
                        "free";

  // Store role in localStorage as backup
  useEffect(() => {
    if (profileData?.account_type) {
      localStorage.setItem('userRole', profileData.account_type);
    }
  }, [profileData?.account_type]);

  // Calculate main content padding based on sidebar state
  const mainContentClass = isMobile 
    ? "transition-all duration-300" 
    : "lg:pl-[70px] transition-all duration-300";

  // Show error UI if profile loading error
  if (profileError) {
    console.error("Dashboard profile loading error:", profileError);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Unable to load profile</h2>
        <p className="text-muted-foreground mb-6">There was a problem loading your profile information.</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/auth/login")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go to Login
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} userRole={userRoleValue as "free" | "individual" | "business"} />
        
        <main className={`flex-1 overflow-y-auto pt-4 px-4 pb-12 ${mainContentClass}`}>
          <div className="container mx-auto animate-in">
            {profileLoading && !hasLoadingTimeout ? (
              <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
              </div>
            ) : (
              <ErrorBoundary FallbackComponent={DashboardFallback}>
                {children}
              </ErrorBoundary>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
