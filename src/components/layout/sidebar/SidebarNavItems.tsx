
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { navItems } from "./sidebarNavConfig";

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
  
  // Filter the navigation items based on the user's role
  const filteredNavItems = navItems.filter(item => {
    // If the item should only be shown for certain roles
    if (item.showFor && !item.showFor.includes(userRole as any)) {
      return false;
    }
    
    return true;
  });

  // Add the search item for non-staff users
  const shouldShowSearch = userRole !== 'staff' && openCommandSearch;

  return (
    <nav className="space-y-1 px-3 py-2">
      {shouldShowSearch && (
        <button 
          className={cn(
            "w-full flex items-center px-3 py-2 text-sm group rounded-md text-muted-foreground hover:bg-muted transition-colors",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          onClick={openCommandSearch}
        >
          <Search className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="ml-3">Search</span>}
        </button>
      )}
      
      {filteredNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={`/dashboard/${item.path}`}
          onClick={onNavClick}
          end={item.path === ""}
          className={({ isActive }) => 
            cn(
              "flex items-center px-3 py-2 text-sm group rounded-md transition-colors",
              isActive 
                ? "bg-accent text-accent-foreground font-medium" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )
          }
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="ml-3">{item.label}</span>}
          {!isCollapsed && item.badge && (
            <span className="ml-auto bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs font-medium">
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNavItems;
