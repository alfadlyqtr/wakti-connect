
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchUnreadNotificationsCount } from "@/services/notifications/notificationService";
import { MessageSquare, Users, HeartHandshake, Bell } from "lucide-react";
import { UserRole } from "@/types/user";

// This component is no longer used in the navbar directly,
// but keeping it for any other places that might reference it.
// In future refactoring, we may want to completely remove this component.

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge: number | null;
  showForRoles: UserRole[];
}

interface NavItemsProps {
  unreadMessages: any[];
  unreadNotifications: any[];
  userRole?: UserRole | null;
  isMobile?: boolean;
}

const NavItems = ({ unreadMessages, unreadNotifications, userRole, isMobile = false }: NavItemsProps) => {
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
      badge: unreadMessages.length > 0 ? unreadMessages.length : null,
      showForRoles: ['individual', 'business']
    },
    { 
      icon: Users, 
      label: 'Contacts', 
      path: '/dashboard/contacts', 
      badge: null,
      showForRoles: ['individual', 'business']
    },
    { 
      icon: HeartHandshake, 
      label: 'Subscribers', 
      path: '/dashboard/subscribers', 
      badge: null,
      showForRoles: ['business']
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/dashboard/notifications', 
      badge: notificationCount > 0 ? notificationCount : null,
      showForRoles: ['individual', 'business', 'staff']
    },
  ];

  // Filter items based on user role
  const filteredItems = navItems.filter(item => {
    // If no role, don't show any items
    if (!userRole) return false;
    // If the user's role is in the showForRoles array, show the item
    return item.showForRoles.includes(userRole);
  });

  return (
    <div className="flex items-center gap-2">
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
