
import React from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { navItems, NavItem, NavSection, SidebarNavItem as SidebarNavItemType } from "./sidebarNavConfig";
import { useSidebarData } from "./useSidebarData";
import SidebarNavItem from "./SidebarNavItem";
import SidebarSectionHeader from "./SidebarSectionHeader";

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
    // Handle root dashboard path
    if (path === '' && location.pathname === '/dashboard') {
      return true;
    }
    return path ? location.pathname.startsWith('/dashboard/' + path) : false;
  };

  const handleNavClick = (path: string) => {
    // Invalidate specific queries based on the route
    if (path === 'messages') {
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    }
    
    if (onNavClick) {
      onNavClick();
    }
  };

  const isItemVisible = (item: SidebarNavItemType) => {
    if (!userData) return false;
    
    if ('section' in item) {
      return item.showFor.includes(userData.accountType as 'free' | 'individual' | 'business');
    } else {
      return item.showFor.includes(userData.accountType as 'free' | 'individual' | 'business');
    }
  };

  return (
    <div className="flex flex-col gap-1 px-2">
      {navItems.map((item, index) => {
        // Skip if item should not be shown for current user type
        if (!isItemVisible(item)) {
          return null;
        }

        // Section header (only show when not collapsed)
        if ('section' in item) {
          return !isCollapsed ? (
            <SidebarSectionHeader 
              key={`section-${index}`} 
              title={item.section} 
            />
          ) : null;
        }

        // Navigation item with badge for messages
        const navItem: NavItem = {
          ...item as NavItem,
          badge: item.path === 'messages' ? unreadMessagesCount > 0 ? unreadMessagesCount : null : null
        };

        // Navigation item
        return (
          <SidebarNavItem
            key={item.path}
            item={navItem}
            isActive={isActive(item.path)}
            isMobile={isMobile}
            isCollapsed={isCollapsed}
            onClick={handleNavClick}
          />
        );
      })}
    </div>
  );
};

export default SidebarNavItems;
