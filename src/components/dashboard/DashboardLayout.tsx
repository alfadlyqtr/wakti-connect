import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import "@/components/layout/sidebar/sidebar.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "free" | "individual" | "business";
}

const DashboardLayout = ({ children, userRole: propUserRole }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<"free" | "individual" | "business">(propUserRole || "free");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserRole = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session found, redirecting to auth page");
          navigate("/auth");
          return;
        }
        
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user profile:", error);
          if (error.code === 'PGRST116') {
            console.log("Profile not found, user may need to sign up");
            navigate("/auth");
          }
          return;
        }
        
        if (profileData?.account_type) {
          setUserRole(profileData.account_type as "free" | "individual" | "business");
          console.log("User role set from DB:", profileData.account_type);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!propUserRole) {
      getUserRole();
    } else {
      setUserRole(propUserRole);
      setLoading(false);
    }
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        getUserRole();
      } else if (event === 'SIGNED_OUT') {
        setUserRole("free");
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} userRole={userRole} />
        
        <main className="flex-1 overflow-y-auto pt-4 px-4 pb-12 lg:pl-64 transition-all duration-300">
          <div className="container mx-auto animate-in">
            {loading ? (
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
