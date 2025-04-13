
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import SidebarNavItems from "./sidebar/SidebarNavItems";
import SidebarUpgradeBanner from "./sidebar/SidebarUpgradeBanner";
import SidebarProfile from "./sidebar/SidebarProfile";
import CollapseToggle from "./sidebar/CollapseToggle";
import SidebarContainer from "./sidebar/SidebarContainer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole } from "@/types/user";
import SidebarUpgradeButton from "./sidebar/SidebarUpgradeButton";

// Define profile type to ensure TypeScript knows about our new columns
interface SidebarProfileData {
  id: string;
  full_name: string | null;
  display_name: string | null;
  business_name: string | null;
  account_type: UserRole;
  avatar_url: string | null;
}

interface SidebarProps {
  isOpen: boolean;
  userRole: UserRole;
  onCollapseChange?: (collapsed: boolean) => void;
  closeSidebar?: () => void;
  openCommandSearch?: () => void;
  showUpgradeButton?: boolean;
  collapsed: boolean;
}

const Sidebar = ({ 
  isOpen, 
  userRole, 
  onCollapseChange, 
  closeSidebar,
  openCommandSearch,
  showUpgradeButton = false,
  collapsed
}: SidebarProps) => {
  // Check local storage for saved sidebar state
  useEffect(() => {
    // Notify parent about initial collapsed state
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [onCollapseChange, collapsed]);
  
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

  // Handle navigation click to close sidebar on mobile
  const handleNavClick = () => {
    if (closeSidebar) {
      closeSidebar();
    }
  };

  // Simple boolean flags for role-based UI decisions
  const isStaffUser = userRole === "staff";
  const isFreeUser = userRole === "free";
  
  // Free users who are not staff should see upgrade features
  const shouldShowUpgradeFeatures = isFreeUser && !isStaffUser;

  return (
    <SidebarContainer 
      isOpen={isOpen} 
      collapsed={collapsed} 
      onCollapseChange={onCollapseChange}
    >
      {/* Toggle collapse button - Only visible on desktop */}
      <CollapseToggle collapsed={collapsed} toggleCollapse={() => {
        if (onCollapseChange) {
          onCollapseChange(!collapsed);
        }
      }} />
      
      {/* User Profile Section */}
      <SidebarProfile profileData={profileData} collapsed={collapsed} />
      
      {/* Navigation Items - Wrap in ScrollArea for proper scrolling */}
      <ScrollArea className="flex-grow">
        <SidebarNavItems 
          onNavClick={handleNavClick} 
          isCollapsed={collapsed} 
          openCommandSearch={openCommandSearch}
        />
        
        {/* Upgrade Button - Only shown for free accounts that need to upgrade */}
        {showUpgradeButton && !isStaffUser && (
          <SidebarUpgradeButton collapsed={collapsed} />
        )}
      </ScrollArea>
      
      {/* Upgrade Banner - Only show for free users and when not collapsed */}
      {shouldShowUpgradeFeatures && !collapsed && (
        <div className="mt-auto px-3 pb-5">
          <SidebarUpgradeBanner />
        </div>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
