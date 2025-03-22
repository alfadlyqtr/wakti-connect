
import React from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { navItems, NavItem } from "./sidebarNavConfig";
import SidebarNavItem from "./SidebarNavItem";

interface SidebarNavItemsProps {
  onNavClick: (path: string) => void;
  isCollapsed?: boolean;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ 
  onNavClick,
  isCollapsed = false
}) => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole') as 'free' | 'individual' | 'business' || 'free';
  
  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => {
    return item.showFor.includes(userRole);
  });
  
  // Helper to check if a nav item is active
  const isActive = (item: NavItem) => {
    const path = `/dashboard/${item.path}`;
    // For dashboard home
    if (item.path === "" && location.pathname === "/dashboard") {
      return true;
    }
    // For regular routes
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col gap-1.5 px-2.5">
      {filteredNavItems.map((item) => (
        <SidebarNavItem
          key={item.path}
          item={item}
          isActive={isActive(item)}
          isMobile={isMobile}
          isCollapsed={isCollapsed}
          onClick={onNavClick}
        />
      ))}
    </div>
  );
};

export default SidebarNavItems;
