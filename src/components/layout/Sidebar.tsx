
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarNavItems from "./sidebar/SidebarNavItems";
import SidebarUpgradeBanner from "./sidebar/SidebarUpgradeBanner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define profile type to ensure TypeScript knows about our new columns
interface SidebarProfileData {
  id: string;
  full_name: string | null;
  display_name: string | null;
  business_name: string | null;
  account_type: "free" | "individual" | "business";
  avatar_url: string | null;
}

interface SidebarProps {
  isOpen: boolean;
  userRole: "free" | "individual" | "business";
}

const Sidebar = ({ isOpen, userRole }: SidebarProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true); // Default to collapsed
  
  // Check local storage for saved sidebar state
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
  }, []);
  
  // Save sidebar state to local storage
  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };
  
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
    if (profileData?.account_type === 'business') {
      return profileData?.business_name || 'Business Account';
    }
    if (profileData?.display_name) return profileData.display_name;
    if (profileData?.full_name) return profileData.full_name;
    
    // Provide role-based fallback
    if (profileData?.account_type === 'individual') return 'Individual Account';
    return 'User';
  };
  
  const getSubtitle = () => {
    if (profileData?.account_type === 'business') {
      return profileData?.display_name || 'Account Admin'; 
    }
    return `${profileData?.account_type || 'Free'} Plan`;
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
  }, [location.pathname]);

  return (
    <aside 
      id="sidebar"
      className={`fixed top-[70px] left-0 z-40 h-[calc(100vh-70px)] bg-card border-r shadow-sm pt-5 transition-all duration-300 lg:translate-x-0 ${
        isOpen ? 'sidebar-open' : 'sidebar-closed'
      } ${collapsed ? 'w-[70px]' : 'w-56'}`}
    >
      <div className="h-full flex flex-col relative">
        {/* Toggle collapse button - Only visible on desktop */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-2 h-6 w-6 rounded-full border bg-background shadow-md hidden lg:flex items-center justify-center"
          onClick={toggleCollapse}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
        
        {/* User Profile Section */}
        <div className={`px-4 mb-6 ${collapsed ? 'text-center' : ''}`}>
          <NavLink to="/dashboard/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profileData?.avatar_url || undefined} />
              <AvatarFallback className="bg-wakti-blue/10 text-wakti-blue">
                {getDisplayName().charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate max-w-[140px]">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground capitalize">{getSubtitle()}</p>
              </div>
            )}
          </NavLink>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-grow overflow-y-auto">
          <SidebarNavItems onNavClick={() => {}} isCollapsed={collapsed} />
        </div>
        
        {/* Upgrade Banner - Only show for free users and when not collapsed */}
        {userRole === "free" && !collapsed && (
          <div className="mt-auto px-3 pb-5">
            <SidebarUpgradeBanner />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
