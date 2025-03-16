
import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarNavItems } from "./sidebar/SidebarNavItems";
import { SidebarUpgradeBanner } from "./sidebar/SidebarUpgradeBanner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  isOpen: boolean;
  userRole: "free" | "individual" | "business";
}

// Define profile type to ensure TypeScript knows about our new columns
interface SidebarProfileData {
  id: string;
  full_name: string | null;
  display_name: string | null;
  business_name: string | null;
  account_type: "free" | "individual" | "business";
  avatar_url: string | null;
}

const Sidebar = ({ isOpen, userRole }: SidebarProps) => {
  const location = useLocation();
  
  // Fetch user profile for sidebar
  const { data: profileData } = useQuery({
    queryKey: ['sidebarProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, display_name, business_name, account_type, avatar_url')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching sidebar profile:", error);
        return null;
      }
      
      return data as SidebarProfileData;
    },
  });

  // Determine display name for profile
  const getDisplayName = () => {
    if (profileData?.display_name) return profileData.display_name;
    if (profileData?.business_name) return profileData.business_name;
    if (profileData?.full_name) return profileData.full_name;
    return 'User';
  };
  
  // Close sidebar on route change for mobile
  useEffect(() => {
    const handleRouteChange = () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && window.innerWidth < 1024) {
        sidebar.classList.add('sidebar-closed');
        sidebar.classList.remove('sidebar-open');
      }
    };
    
    handleRouteChange();
    return () => {
      // Cleanup
    };
  }, [location.pathname]);

  return (
    <aside 
      id="sidebar"
      className={`fixed top-[70px] left-0 z-40 h-[calc(100vh-70px)] bg-card border-r shadow-sm pt-5 transition-all duration-300 lg:translate-x-0 ${
        isOpen ? 'sidebar-open' : 'sidebar-closed'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* User Profile Section */}
        <div className="px-4 mb-6">
          <NavLink to="/dashboard/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profileData?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10">
                {getDisplayName().charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="sidebar-content overflow-hidden">
              <p className="font-medium text-sm truncate max-w-[140px]">{getDisplayName()}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole} Plan</p>
            </div>
          </NavLink>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-grow overflow-y-auto">
          <SidebarNavItems userRole={userRole} />
        </div>
        
        {/* Upgrade Banner - Only show for free users */}
        {userRole === "free" && (
          <div className="mt-auto sidebar-content px-3 pb-5">
            <SidebarUpgradeBanner />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
