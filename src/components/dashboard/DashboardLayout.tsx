
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import "@/components/layout/sidebar/sidebar.css";
import { useQuery } from "@tanstack/react-query";

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          .single();
        
        if (error) {
          console.error("Error fetching user profile:", error);
          if (error.code === 'PGRST116') {
            console.log("Profile not found, user may need to sign up");
            navigate("/auth");
          }
          return null;
        }
        
        if (data.account_type === 'business' && !data.business_name) {
          // If business account but no business name is set, inform the user
          toast({
            title: "Complete your business profile",
            description: "Please set your business name in your profile settings",
            action: (
              <button 
                className="bg-primary text-white px-3 py-1 rounded-md text-xs"
                onClick={() => navigate("/dashboard/profile")}
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
  });

  // Set theme based on user preference
  useEffect(() => {
    if (profileData?.theme_preference) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(profileData.theme_preference);
    }
  }, [profileData?.theme_preference]);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    if (!propUserRole) {
      checkAuth();
    } else {
      setLoading(false);
    }
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [propUserRole, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const userRoleValue = profileData?.account_type || propUserRole || "free";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} userRole={userRoleValue as "free" | "individual" | "business"} />
        
        <main className="flex-1 overflow-y-auto pt-4 px-4 pb-12 lg:pl-64 transition-all duration-300">
          <div className="container mx-auto animate-in">
            {loading || profileLoading ? (
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
