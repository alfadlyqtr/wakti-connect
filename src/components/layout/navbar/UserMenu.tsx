
import React from "react";
import { MessageSquare, Users, HeartHandshake, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import MobileNavItems from "./MobileNavItems";
import AccountMenuItems from "./AccountMenuItems";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserMenuProps {
  isAuthenticated: boolean;
  unreadMessages: any[];
  unreadNotifications: any[];
}

const UserMenu = ({ isAuthenticated, unreadMessages, unreadNotifications }: UserMenuProps) => {
  const { t } = useTranslation();
  
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
  
  // Determine the display name based on account type
  const getDisplayName = () => {
    if (!profileData) return t('common.account');
    
    if (profileData.account_type === 'business' && profileData.business_name) {
      return profileData.business_name;
    } else if (profileData.display_name) {
      return profileData.display_name;
    } else if (profileData.full_name) {
      return profileData.full_name;
    } else {
      return t('common.account');
    }
  };
  
  const navItems = [
    { 
      icon: MessageSquare, 
      label: 'Messages', 
      path: '/dashboard/messages', 
      badge: unreadMessages.length > 0 ? unreadMessages.length : null 
    },
    { 
      icon: Users, 
      label: 'Contacts', 
      path: '/dashboard/contacts', 
      badge: null 
    },
    { 
      icon: HeartHandshake, 
      label: 'Subscribers', 
      path: '/dashboard/subscribers', 
      badge: null,
      showForBusiness: true
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/dashboard/notifications', 
      badge: notificationCount > 0 ? notificationCount : null
    },
  ];
  
  // Filter for business-only items
  const filteredNavItems = navItems.filter(item => {
    if (item.showForBusiness && !localStorage.getItem('userRole')?.includes('business')) {
      return false;
    }
    return true;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-muted" aria-label="User menu">
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{getDisplayName()}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Mobile menu items - only visible on small screens */}
        <div className="md:hidden">
          <MobileNavItems filteredNavItems={filteredNavItems} />
          <DropdownMenuSeparator />
        </div>
        
        <AccountMenuItems isAuthenticated={isAuthenticated} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
