
import React from "react";
import { MessageSquare, Users, HeartHandshake, Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileNavItems from "./MobileNavItems";
import AccountMenuItems from "./AccountMenuItems";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchUnreadNotificationsCount } from "@/services/notifications/notificationService";
import { useStaffWorkingStatus } from "@/hooks/staff/useStaffWorkingStatus";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface UserMenuProps {
  isAuthenticated: boolean;
  unreadMessages: any[];
  unreadNotifications: any[];
  userRole?: string | null;
}

const UserMenu = ({ isAuthenticated, unreadMessages, unreadNotifications, userRole }: UserMenuProps) => {
  const { data: staffStatus } = useStaffWorkingStatus();
  const isWorking = staffStatus?.isWorking || false;
  const isStaff = userRole === 'staff';
  const isBusiness = userRole === 'business';
  
  // Fetch user profile data for displaying name
  const { data: profileData } = useQuery({
    queryKey: ['userMenuProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('display_name, business_name, full_name, account_type')
        .eq('id', session.user.id)
        .single();
        
      return data;
    },
    enabled: isAuthenticated,
  });
  
  // Use notification service to get unread count
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: fetchUnreadNotificationsCount,
    enabled: isAuthenticated,
  });
  
  // Determine if user icon should pulse/blink
  const shouldPulse = 
    unreadMessages.length > 0 || 
    notificationCount > 0;
  
  // Determine the display name based on account type
  const getDisplayName = () => {
    if (!profileData) return 'Account';
    
    if (profileData.account_type === 'business' && profileData.business_name) {
      return profileData.business_name;
    } else if (profileData.display_name) {
      return profileData.display_name;
    } else if (profileData.full_name) {
      return profileData.full_name;
    } else {
      return 'Account';
    }
  };
  
  // Define nav items with proper typing
  type NavItem = {
    icon: React.ElementType;
    label: string;
    path: string;
    badge: number | null;
    showForBusiness?: boolean;
    hideForStaff?: boolean;
  };
  
  const navItems: NavItem[] = [
    { 
      icon: MessageSquare, 
      label: 'Messages', 
      path: '/dashboard/messages', 
      badge: unreadMessages.length > 0 ? unreadMessages.length : null,
      hideForStaff: true
    },
    { 
      icon: Users, 
      label: 'Contacts', 
      path: '/dashboard/contacts', 
      badge: null,
      hideForStaff: true
    },
    { 
      icon: HeartHandshake, 
      label: 'Subscribers', 
      path: '/dashboard/subscribers', 
      badge: null,
      showForBusiness: true,
      hideForStaff: true
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/dashboard/notifications', 
      badge: notificationCount > 0 ? notificationCount : null,
      hideForStaff: true
    },
  ];
  
  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (item.hideForStaff && isStaff) {
      return false;
    }
    if (item.showForBusiness && !isBusiness) {
      return false;
    }
    return true;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "rounded-full h-8 w-8 bg-muted relative", 
            isWorking && "ring-2 ring-green-500",
            shouldPulse && "animate-pulse"
          )} 
          aria-label="User menu"
        >
          <User className="h-4 w-4" />
          {isWorking && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          {getDisplayName()}
          {isWorking && (
            <span className="text-xs font-normal text-green-600">
              (Working)
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Menu items for both mobile and desktop */}
        <div className="px-2 py-1.5">
          {filteredNavItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path}
              className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="relative">
                <item.icon className="h-4 w-4" />
                {item.badge && (
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
        
        {/* Account related items */}
        <AccountMenuItems isAuthenticated={isAuthenticated} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
