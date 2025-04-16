
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, User, MessageSquare, Settings, Menu, Search, Brain, Plus } from "lucide-react";
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

  // Determine if we're on a page that should show the floating action button
  const shouldShowFAB = !location.pathname.includes('/messages') && 
                        !location.pathname.includes('/settings');

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 sm:block lg:hidden safe-area-bottom">
        <div className="grid grid-cols-5 h-16">
          {filteredItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.action ? (
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center h-full rounded-none hover:bg-muted touch-target"
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
                      "flex flex-col items-center justify-center h-full rounded-none hover:bg-muted touch-target",
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

      {/* Floating Action Button - only shown on certain pages */}
      {shouldShowFAB && !isStaff && (
        <Button 
          size="icon" 
          className="fab bg-primary hover:bg-primary/90 h-14 w-14 shadow-lg"
          aria-label="Add new item"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </>
  );
};

export default MobileNavigation;
