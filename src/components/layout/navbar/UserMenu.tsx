
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

interface UserMenuProps {
  isAuthenticated: boolean;
  unreadMessages: any[];
  unreadNotifications: any[];
}

const UserMenu = ({ isAuthenticated, unreadMessages, unreadNotifications }: UserMenuProps) => {
  const { t } = useTranslation();
  
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
      badge: unreadNotifications.length > 0 ? unreadNotifications.length : null
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
        <DropdownMenuLabel>{t('common.myAccount')}</DropdownMenuLabel>
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
