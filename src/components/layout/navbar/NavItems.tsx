
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, HeartHandshake, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchUnreadNotificationsCount } from "@/services/notifications/notificationService";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge: number | null;
  showForBusiness?: boolean;
}

interface NavItemsProps {
  unreadMessages: any[];
  unreadNotifications: any[];
  isMobile?: boolean;
}

const NavItems = ({ unreadMessages, unreadNotifications, isMobile = false }: NavItemsProps) => {
  const navigate = useNavigate();
  
  // Use our notification service to get unread count
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: fetchUnreadNotificationsCount,
  });
  
  const navItems: NavItem[] = [
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

  // Only show items that should be visible based on user role
  const filteredItems = navItems.filter(item => {
    if (item.showForBusiness && !localStorage.getItem('userRole')?.includes('business')) {
      return false;
    }
    return true;
  });

  if (isMobile) {
    return null; // Mobile navigation is handled in the UserMenu component
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      {filteredItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => navigate(item.path)}
          aria-label={item.label}
        >
          <item.icon className="h-5 w-5" />
          {item.badge && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {item.badge > 9 ? '9+' : item.badge}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};

export default NavItems;
