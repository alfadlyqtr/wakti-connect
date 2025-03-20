
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import "@/components/layout/sidebar/sidebar.css";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/useResponsive";

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
  const [errorLogged, setErrorLogged] = useState(false);

  // Fetch user profile data for the dashboard
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['dashboardUserProfile'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session found, redirecting to auth page");
          navigate("/auth");
          return null;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('account_type, display_name, business_name, full_name, theme_preference')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching user profile:", error);
          if (error.code === 'PGRST116' && !errorLogged) {
            console.log("Profile not found, user may need to sign up");
            setErrorLogged(true);
            
            // Try to create a profile for this user if it doesn't exist
            try {
              const { data: newProfileData, error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  full_name: session.user.email?.split('@')[0] || 'User',
                  display_name: session.user.email?.split('@')[0] || 'User',
                  account_type: 'free'
                })
                .select()
                .single();
                
              if (createError) {
                console.error("Error creating profile:", createError);
              } else {
                console.log("Created new profile:", newProfileData);
                return newProfileData as ProfileData;
              }
            } catch (createError) {
              console.error("Failed to create profile:", createError);
            }
          }
          return null;
        }
        
        // Store user role in localStorage for use in other components
        if (data?.account_type) {
          localStorage.setItem('userRole', data.account_type);
        }
        
        if (data?.account_type === 'business' && !data.business_name) {
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
        console.error("Error fetching user profile:", error);
        return null;
      }
    },
    retry: 2,
    retryDelay: 1000,
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

  // Close sidebar on navigation when on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get the correct user role
  const userRoleValue = profileData?.account_type || propUserRole || "free";

  // Calculate main content padding based on sidebar state
  const mainContentClass = isMobile 
    ? "transition-all duration-300" 
    : "lg:pl-[70px] transition-all duration-300";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} userRole={userRoleValue as "free" | "individual" | "business"} />
        
        <main className={`flex-1 overflow-y-auto pt-4 px-4 pb-safe-area-inset-bottom ${mainContentClass}`}>
          <div className="container mx-auto animate-in">
            {profileLoading ? (
              <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
