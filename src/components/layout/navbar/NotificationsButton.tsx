
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchUnreadNotificationsCount } from "@/services/notifications/notificationService";
import { useNavigate } from "react-router-dom";

interface NotificationsButtonProps {
  className?: string;
}

const NotificationsButton: React.FC<NotificationsButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  
  // Use our notification service to get unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: fetchUnreadNotificationsCount,
  });

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`relative ${className}`}
      onClick={() => navigate('/dashboard/notifications')}
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default NotificationsButton;
