
import React from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { navItems, NavItem, NavSection } from "./sidebarNavConfig";
import { useSidebarData } from "./useSidebarData";
import SidebarNavItem from "./SidebarNavItem";
import SidebarSectionHeader from "./SidebarSectionHeader";

interface SidebarNavItemsProps {
  onNavClick?: () => void;
}

const SidebarNavItems = ({ onNavClick }: SidebarNavItemsProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { userData, unreadMessagesCount } = useSidebarData();
  const queryClient = useQueryClient();

  const isActive = (path: string) => {
    return location.pathname.startsWith('/dashboard/' + path);
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

  const isItemVisible = (item: NavItem | NavSection) => {
    if (!userData) return false;
    return item.showFor.includes(userData.accountType as 'free' | 'individual' | 'business');
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      {navItems.map((item, index) => {
        // Skip if section or item should not be shown for current user type
        if (!isItemVisible(item)) {
          return null;
        }

        // Section header
        if ('section' in item) {
          return (
            <SidebarSectionHeader 
              key={`section-${index}`} 
              title={item.section} 
            />
          );
        }

        // Navigation item with badge for messages
        const navItem = {
          ...item,
          badge: item.path === 'messages' ? unreadMessagesCount > 0 ? unreadMessagesCount : null : null
        };

        // Navigation item
        return (
          <SidebarNavItem
            key={item.path}
            item={navItem as NavItem}
            isActive={isActive(item.path)}
            isMobile={isMobile}
            onClick={handleNavClick}
          />
        );
      })}
    </div>
  );
};

export default SidebarNavItems;
