
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search, Brain } from "lucide-react";
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
  const userRole = localStorage.getItem('userRole') || 'individual';
  console.log("Current user role:", userRole);
  console.log("Available nav items:", navItems);
  
  // Filter the navigation items based on the user's role
  const filteredNavItems = navItems.filter(item => {
    // If the item has showFor property and current role isn't included
    if (item.showFor && !item.showFor.includes(userRole as any)) {
      return false;
    }
    
    // Special handling for AI Assistant - hide for staff users
    if (item.path === "ai-assistant" && userRole === 'staff') {
      return false;
    }
    
    return true;
  });
  
  console.log("Filtered nav items:", filteredNavItems);

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
          
          {/* Special badge for AI Assistant */}
          {!isCollapsed && item.path === "ai-assistant" && (
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
