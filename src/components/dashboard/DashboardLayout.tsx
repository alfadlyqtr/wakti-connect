
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "free" | "individual" | "business";
}

const DashboardLayout = ({ children, userRole: propUserRole }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<"free" | "individual" | "business">(propUserRole || "free");

  useEffect(() => {
    // Fetch user role from Supabase if not provided as prop
    const getUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();
          
          if (profileData?.account_type) {
            setUserRole(profileData.account_type as "free" | "individual" | "business");
            console.log("User role set from DB:", profileData.account_type);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    if (!propUserRole) {
      getUserRole();
    } else {
      setUserRole(propUserRole);
    }
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        getUserRole();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [propUserRole]);

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
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
