
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { navItems, NavItem } from "./sidebarNavConfig";
import SidebarNavItem from "./SidebarNavItem";
import { isUserStaff } from "@/utils/staffUtils";

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
  const [isStaff, setIsStaff] = useState(false);
  
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole') as 'free' | 'individual' | 'business' | 'staff' || 'free';
  
  // Check if user is staff on component mount
  useEffect(() => {
    const checkStaffStatus = async () => {
      const staffStatus = await isUserStaff();
      setIsStaff(staffStatus);
      
      // If user is staff, store this information
      if (staffStatus) {
        localStorage.setItem('isStaff', 'true');
      }
    };
    
    // Check localStorage first for quick loading
    if (localStorage.getItem('isStaff') === 'true') {
      setIsStaff(true);
    } else {
      checkStaffStatus();
    }
  }, []);
  
  // FIXED: Filter navigation items based on user role, prioritizing business role if applicable
  const filteredNavItems = navItems.filter(item => {
    // Business users see business nav items, even if they're also staff
    if (userRole === 'business') {
      return item.showFor.includes('business');
    }
    
    // Staff users see staff nav items (only if they're not also business owners)
    if (isStaff && userRole === 'staff') {
      return item.showFor.includes('staff');
    }
    
    // All other users see nav items according to their role
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
