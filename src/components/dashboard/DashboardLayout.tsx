import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import "@/components/layout/sidebar/sidebar.css";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

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

const DashboardLayout = ({ children, userRole: propUserRole }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    console.log("DashboardLayout: Initial render with auth state:", {
      isAuthenticated,
      authLoading,
      userId: user?.id
    });
  }, []);

  const { data: profileData, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['dashboardUserProfile', user?.id],
    queryFn: async () => {
      try {
        console.log("DashboardLayout: Fetching user profile data for user:", user?.id);
        
        if (!user?.id) {
          console.log("DashboardLayout: No active user found, cannot fetch profile");
          return null;
        }
        
        try {
          const { data: testData, error: testError } = await supabase
            .from('profiles')
            .select('count(*)', { count: 'exact', head: true });
            
          if (testError && testError.code === 'PGRST116') {
            console.error("DashboardLayout: Profiles table not found");
            return {
              account_type: "free" as const,
              display_name: user.displayName || null,
              business_name: null,
              full_name: user.name || null,
              theme_preference: "light"
            };
          }
        } catch (testError) {
          console.error("DashboardLayout: Error testing profiles table:", testError);
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('account_type, display_name, business_name, full_name, theme_preference')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("DashboardLayout: Error fetching user profile:", error);
          if (error.code === 'PGRST116') {
            console.log("DashboardLayout: Profile not found, user may need to complete signup");
            return {
              account_type: "free" as const,
              display_name: user.displayName || null,
              business_name: null,
              full_name: user.name || null,
              theme_preference: "light"
            };
          }
          throw error;
        }
        
        if (!data) {
          console.log("DashboardLayout: No profile data found, using defaults");
          return {
            account_type: "free" as const,
            display_name: user.displayName || null,
            business_name: null,
            full_name: user.name || null,
            theme_preference: "light"
          };
        }
        
        console.log("DashboardLayout: Profile data loaded successfully:", data);
        
        localStorage.setItem('userRole', data.account_type);
        
        if (data.account_type === 'business' && !data.business_name) {
          toast({
            title: "Complete your business profile",
            description: "Please set your business name in your profile settings",
            action: (
              <button 
                className="bg-primary text-white px-3 py-1 rounded-md text-xs"
                onClick={() => navigate("/dashboard/settings")}
              >
                Update Profile
              </button>
            )
          });
        }
        
        return data as ProfileData;
      } catch (error) {
        console.error("DashboardLayout: Error fetching user profile:", error);
        return {
          account_type: "free" as const,
          display_name: user?.displayName || null,
          business_name: null,
          full_name: user?.name || null,
          theme_preference: "light"
        };
      }
    },
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2000 : 1000, 10000),
    enabled: isAuthenticated && !authLoading && !!user?.id,
    staleTime: 300000
  });

  useEffect(() => {
    if (profileData?.theme_preference) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(profileData.theme_preference);
    }
  }, [profileData?.theme_preference]);

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

  const userRoleValue = profileData?.account_type || propUserRole || localStorage.getItem('userRole') as "free" | "individual" | "business" || "free";

  const mainContentClass = isMobile 
    ? "transition-all duration-300" 
    : "lg:pl-[70px] transition-all duration-300";

  const isLoading = authLoading || (profileLoading && isAuthenticated);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }
  
  if (!isAuthenticated && !authLoading) {
    console.log("DashboardLayout: User not authenticated, redirecting");
    navigate("/auth/login");
    return null;
  }
  
  if (profileError && !profileData) {
    console.error("DashboardLayout: Profile error", profileError);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error loading dashboard</h2>
        <p className="text-muted-foreground mb-4">
          There was a problem loading your profile. Please try signing in again.
        </p>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => navigate("/auth/login")}
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} userRole={userRoleValue} />
        
        <main className={`flex-1 overflow-y-auto pt-4 px-4 pb-12 ${mainContentClass}`}>
          <div className="container mx-auto animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
