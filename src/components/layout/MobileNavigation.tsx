
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, User, MessageSquare, Settings, Menu, Search, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileNavigationProps {
  toggleSidebar: () => void;
  openCommandSearch?: () => void;
  userRole?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  toggleSidebar, 
  openCommandSearch,
  userRole
}) => {
  const location = useLocation();
  const isStaff = userRole === 'staff';
  
  // Define navigation items based on user role
  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/dashboard",
      showFor: ["free", "individual", "business", "staff", "super-admin"],
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/dashboard/messages",
      showFor: ["free", "individual", "business", "super-admin"],
    },
    {
      icon: Brain,
      label: "AI",
      path: "/dashboard/ai-assistant",
      showFor: ["free", "individual", "business", "super-admin"],
    },
    {
      icon: User,
      label: "Profile",
      path: "/dashboard/profile",
      showFor: ["free", "individual", "business", "staff", "super-admin"],
    },
    {
      icon: Menu,
      label: "More",
      path: "#",
      action: toggleSidebar,
      showFor: ["free", "individual", "business", "staff", "super-admin"],
    },
  ];

  // Filter items based on user role
  const filteredItems = navItems.filter(item => {
    // If staff, don't show AI
    if (isStaff && item.path === "/dashboard/ai-assistant") {
      return false;
    }
    
    return item.showFor.includes(userRole || 'free');
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 sm:block lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {filteredItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.action ? (
              <Button
                variant="ghost"
                className="flex flex-col items-center justify-center h-full rounded-none hover:bg-muted"
                onClick={item.action}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Button>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center h-full rounded-none hover:bg-muted",
                    isActive && "text-primary bg-primary/10"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </NavLink>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
