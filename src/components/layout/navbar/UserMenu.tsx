
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  LogOut, 
  Settings,
  MessageSquare, 
  Users, 
  HeartHandshake,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface UserMenuProps {
  isAuthenticated: boolean;
  unreadMessages: any[];
  unreadNotifications: any[];
}

const UserMenu = ({ isAuthenticated, unreadMessages, unreadNotifications }: UserMenuProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  
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
          {filteredNavItems.map((item, index) => (
            <DropdownMenuItem key={`mobile-${index}`} asChild>
              <Link to={item.path} className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </div>
                {item.badge && (
                  <Badge variant="destructive" className="ml-2">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
        </div>
        
        <DropdownMenuItem asChild>
          <Link to="/dashboard/settings">
            <Settings className="h-4 w-4 mr-2" />
            {t('dashboard.settings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isAuthenticated ? (
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            {t('common.logOut')}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/auth">{t('common.logIn')} / {t('common.signUp')}</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
