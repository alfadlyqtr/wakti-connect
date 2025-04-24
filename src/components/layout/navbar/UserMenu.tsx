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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchUnreadNotificationsCount } from "@/services/notifications/notificationService";
import { useStaffWorkingStatus } from "@/hooks/staff/useStaffWorkingStatus";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useEffectiveRole } from "@/hooks/useEffectiveRole";
import { dropdownNavItems } from "../sidebar/sidebarNavConfig";

interface UserMenuProps {
  isAuthenticated: boolean;
  unreadMessages: any[];
  unreadNotifications: any[];
}

const UserMenu = ({ isAuthenticated, unreadMessages, unreadNotifications }: UserMenuProps) => {
  const { effectiveRole } = useEffectiveRole();
  const { data: staffStatus } = useStaffWorkingStatus();
  const isWorking = staffStatus?.isWorking || false;
  
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
  
  const shouldPulse = 
    unreadMessages.length > 0 || 
    unreadNotifications.length > 0;
  
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

  // Filter navigation items based on user role
  const filteredNavItems = dropdownNavItems.filter(item => {
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
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          {getDisplayName()}
          {isWorking && (
            <span className="text-xs font-normal text-green-600">
              (Working)
            </span>
          )}
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
                {item.badge && item.badge > 0 && (
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
