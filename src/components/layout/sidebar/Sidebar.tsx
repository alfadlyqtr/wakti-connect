
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import SidebarNavItems from "./SidebarNavItems";
import SidebarUpgradeBanner from "./SidebarUpgradeBanner";
import SidebarProfile from "./SidebarProfile";
import CollapseToggle from "./CollapseToggle";
import SidebarContainer from "./SidebarContainer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole } from "@/types/user";
import SidebarUpgradeButton from "./SidebarUpgradeButton";

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
}

const Sidebar = ({ 
  isOpen, 
  userRole, 
  onCollapseChange, 
  closeSidebar,
  openCommandSearch,
  showUpgradeButton = false
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
      if (onCollapseChange) {
        onCollapseChange(savedState === 'true');
      }
    }
  }, [onCollapseChange]);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
  };

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
      
      let effectiveRole: UserRole = 'individual';
      if (data.account_type === 'business') {
        effectiveRole = 'business';
      } else if (data.account_type === 'staff') {
        effectiveRole = 'staff';
      } else if (data.account_type === 'superadmin') {
        effectiveRole = 'superadmin';
      }
      
      return {
        ...data,
        account_type: effectiveRole
      } as SidebarProfileData;
    },
  });

  const handleNavClick = () => {
    if (closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <SidebarContainer 
      isOpen={isOpen} 
      collapsed={collapsed} 
      onCollapseChange={onCollapseChange}
    >
      <CollapseToggle collapsed={collapsed} toggleCollapse={toggleCollapse} />
      
      <SidebarProfile profileData={profileData} collapsed={collapsed} />
      
      <ScrollArea className="flex-grow">
        <SidebarNavItems 
          onNavClick={handleNavClick} 
          isCollapsed={collapsed} 
          openCommandSearch={openCommandSearch}
        />
        
        {showUpgradeButton && (
          <SidebarUpgradeButton collapsed={collapsed} />
        )}
      </ScrollArea>
      
      {userRole === "individual" && !collapsed && (
        <div className="mt-auto px-3 pb-5">
          <SidebarUpgradeBanner />
        </div>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
