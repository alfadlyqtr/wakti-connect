
import React from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavItem, navItems } from "./sidebarNavConfig";
import { useSidebarData } from "./useSidebarData";
import SidebarNavItem from "./SidebarNavItem";

interface SidebarNavItemsProps {
  onNavClick?: () => void;
  isCollapsed?: boolean;
}

const SidebarNavItems = ({ onNavClick, isCollapsed = false }: SidebarNavItemsProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { userData, unreadMessagesCount } = useSidebarData();
  const queryClient = useQueryClient();

  const isActive = (path: string) => {
    if (path === '' && location.pathname === '/dashboard') {
      return true;
    }
    return path ? location.pathname.startsWith('/dashboard/' + path) : false;
  };

  const handleNavClick = (path: string) => {
    if (path === 'messages') {
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    }
    
    if (onNavClick) {
      onNavClick();
    }
  };

  const isItemVisible = (item: NavItem) => {
    if (!userData) return false;
    return item.showFor.includes(userData.accountType as 'free' | 'individual' | 'business');
  };

  const filteredItems = navItems.filter((item): item is NavItem => 
    !('section' in item) && isItemVisible(item)
  );

  return (
    <div className="flex flex-col gap-1.5 px-2 py-1">
      {filteredItems.map((item) => (
        <SidebarNavItem
          key={item.path}
          item={{
            ...item,
            badge: item.path === 'messages' ? unreadMessagesCount > 0 ? unreadMessagesCount : null : null
          }}
          isActive={isActive(item.path)}
          isMobile={isMobile}
          isCollapsed={isCollapsed}
          onClick={handleNavClick}
        />
      ))}
    </div>
  );
};

export default SidebarNavItems;
