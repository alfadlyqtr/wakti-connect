
import React from "react";
import { User, Settings, LogOut, MessageSquare, Users, HeartHandshake, Bell, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AccountMenuItems from "./AccountMenuItems";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { cn } from "@/lib/utils";
import { dropdownNavItems } from "../sidebar/sidebarNavConfig";

interface UserMenuProps {
  unreadMessages: any[];
  unreadNotifications: any[];
}

const UserMenu = ({ unreadMessages = [], unreadNotifications = [] }: UserMenuProps) => {
  const { isAuthenticated, effectiveRole, user } = useAuth();
  
  const shouldPulse = 
    unreadMessages.length > 0 || 
    unreadNotifications.length > 0;
  
  const getDisplayName = () => {
    if (!user) return 'Account';
    
    // Fix the property access to match the AppUser type definition
    if (user.account_type === 'business' && user.business_name) {
      return user.business_name;
    } else if (user.displayName) {
      return user.displayName;
    } else if (user.name) {
      return user.name;
    } else {
      return 'Account';
    }
  };

  // Filter dropdown items based on user role
  const navItemsWithCounts = dropdownNavItems.map(item => {
    if (item.path === 'messages' && unreadMessages.length > 0) {
      return { ...item, badge: unreadMessages.length };
    }
    if (item.path === 'notifications' && unreadNotifications.length > 0) {
      return { ...item, badge: unreadNotifications.length };
    }
    return item;
  });

  const filteredNavItems = navItemsWithCounts.filter(item => {
    if (!effectiveRole) return false;
    return item.showFor.includes(effectiveRole);
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "rounded-full h-8 w-8 bg-muted relative", 
            shouldPulse && "animate-pulse"
          )} 
          aria-label="User menu"
        >
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          {getDisplayName()}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1.5">
          {filteredNavItems.map((item, index) => (
            <Link 
              key={index}
              to={`/dashboard/${item.path}`}
              className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="relative">
                <item.icon className="h-4 w-4" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              {item.label}
            </Link>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        <AccountMenuItems isAuthenticated={isAuthenticated} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
