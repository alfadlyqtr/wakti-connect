
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

  // Fetch user profile data for the dashboard
  const { data: profileData, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['dashboardUserProfile'],
    queryFn: async () => {
      try {
        console.log("DashboardLayout: Fetching user profile data");
        
        if (!user?.id) {
          console.log("DashboardLayout: No active user found, redirecting to auth page");
          navigate("/auth/login");
          return null;
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
            // Return default profile to avoid errors
            return {
              account_type: "free" as const,
              display_name: null,
              business_name: null,
              full_name: null,
              theme_preference: "light"
            };
          }
          throw error;
        }
        
        if (!data) {
          console.log("DashboardLayout: No profile data found, using defaults");
          return {
            account_type: "free" as const,
            display_name: null,
            business_name: null,
            full_name: null,
            theme_preference: "light"
          };
        }
        
        // Store user role in localStorage for use in other components
        localStorage.setItem('userRole', data.account_type);
        
        if (data.account_type === 'business' && !data.business_name) {
          // If business account but no business name is set, inform the user
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
        throw error;
      }
    },
    retry: 1,
    enabled: isAuthenticated && !authLoading && !!user?.id
  });

  // Set theme based on user preference
  useEffect(() => {
    if (profileData?.theme_preference) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(profileData.theme_preference);
    }
  }, [profileData?.theme_preference]);

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

  // Get the correct user role
  const userRoleValue = profileData?.account_type || propUserRole || localStorage.getItem('userRole') as "free" | "individual" | "business" || "free";

  // Calculate main content padding based on sidebar state
  const mainContentClass = isMobile 
    ? "transition-all duration-300" 
    : "lg:pl-[70px] transition-all duration-300";

  // Handle loading state
  const isLoading = authLoading || (profileLoading && isAuthenticated);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }
  
  // Handle not authenticated state
  if (!isAuthenticated && !authLoading) {
    console.log("DashboardLayout: User not authenticated, redirecting");
    navigate("/auth/login");
    return null;
  }
  
  // Handle error state
  if (profileError && !profileData) {
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
