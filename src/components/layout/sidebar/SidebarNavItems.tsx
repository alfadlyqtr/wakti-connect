
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search, Brain } from "lucide-react";
import { navItems } from "./sidebarNavConfig";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarNavItemsProps {
  onNavClick?: () => void;
  isCollapsed?: boolean;
  openCommandSearch?: () => void;
}

const SidebarNavItems = ({ 
  onNavClick, 
  isCollapsed = false,
  openCommandSearch 
}: SidebarNavItemsProps) => {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  const isMobile = useIsMobile();
  
  // Filter the navigation items based on the user's role
  const filteredNavItems = navItems.filter(item => {
    // If the item should only be shown for certain roles
    if (item.showFor && !item.showFor.includes(userRole as any)) {
      return false;
    }
    
    // Special handling for AI Assistant - hide for staff users
    if (item.path === "ai-assistant" && userRole === 'staff') {
      return false;
    }
    
    return true;
  });

  // Add the search item for non-staff users
  const shouldShowSearch = userRole !== 'staff' && openCommandSearch;

  // Handle navigation click - close sidebar on mobile
  const handleNavItemClick = () => {
    if (isMobile && onNavClick) {
      onNavClick();
    }
  };

  return (
    <nav className="space-y-1 px-3 py-2">
      {shouldShowSearch && (
        <button 
          className={cn(
            "w-full flex items-center px-3 py-2 text-sm group rounded-md text-muted-foreground hover:bg-muted transition-colors",
            isCollapsed && !isMobile ? "justify-center" : "justify-start"
          )}
          onClick={() => {
            openCommandSearch?.();
            if (isMobile && onNavClick) {
              onNavClick();
            }
          }}
        >
          <Search className="h-5 w-5 shrink-0" />
          {(!isCollapsed || isMobile) && <span className="ml-3">Search</span>}
        </button>
      )}
      
      {filteredNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={`/dashboard/${item.path}`}
          onClick={handleNavItemClick}
          end={item.path === ""}
          className={({ isActive }) => 
            cn(
              "flex items-center px-3 py-2 text-sm group rounded-md transition-colors",
              isActive 
                ? "bg-accent text-accent-foreground font-medium" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              isCollapsed && !isMobile ? "justify-center" : "justify-start"
            )
          }
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {(!isCollapsed || isMobile) && <span className="ml-3">{item.label}</span>}
          {(!isCollapsed || isMobile) && item.badge && (
            <span className="ml-auto bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs font-medium">
              {item.badge}
            </span>
          )}
          
          {/* Special badge for AI Assistant */}
          {(!isCollapsed || isMobile) && item.path === "ai-assistant" && (
            <span className="ml-auto bg-wakti-blue/10 text-wakti-blue px-1.5 py-0.5 rounded-full text-xs font-medium">
              New
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNavItems;
