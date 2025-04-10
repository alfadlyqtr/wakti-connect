
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  CalendarDays,
  CheckSquare,
  MessageSquare,
  BookOpen,
  Settings,
  Users,
  Star,
  PanelLeft,
  Plus,
  Search,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  
  // Define the navigation items
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
      excludeExact: true
    },
    {
      name: "Tasks",
      path: "/dashboard/tasks",
      icon: CheckSquare,
    },
    {
      name: "Calendar",
      path: "/dashboard/events",
      icon: CalendarDays,
    },
    {
      name: "Messages",
      path: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      name: "Contacts",
      path: "/dashboard/contacts",
      icon: Users,
      hideFor: ['staff']
    },
    {
      name: "Bookings",
      path: "/dashboard/bookings",
      icon: CalendarDays,
      showOnlyFor: ['business', 'individual']
    },
    {
      name: "Job Cards",
      path: "/dashboard/job-cards",
      icon: BookOpen,
      showOnlyFor: ['business', 'staff']
    },
    {
      name: "Jobs",
      path: "/dashboard/jobs",
      icon: PanelLeft,
      showOnlyFor: ['business']
    },
    {
      name: "Business",
      path: "/dashboard/business",
      icon: Building,
      showOnlyFor: ['business']
    },
    {
      name: "Subscribers",
      path: "/dashboard/subscribers",
      icon: Star,
      showOnlyFor: ['business']
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: Settings
    }
  ];

  // Filter the navigation items based on the user's role
  const filteredNavItems = navItems.filter(item => {
    // If the item should be hidden for certain roles
    if (item.hideFor && item.hideFor.includes(userRole as string)) {
      return false;
    }
    
    // If the item should only be shown for certain roles
    if (item.showOnlyFor && !item.showOnlyFor.includes(userRole as string)) {
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
          {!isCollapsed && (
            <span className="ml-auto text-xs text-muted-foreground opacity-60">⌘K</span>
          )}
        </button>
      )}
      
      {filteredNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onNavClick}
          end={!item.excludeExact}
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
          {!isCollapsed && <span className="ml-3">{item.name}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNavItems;
