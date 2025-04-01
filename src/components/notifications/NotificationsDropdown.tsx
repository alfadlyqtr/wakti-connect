
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Check, ChevronRight, MessageSquare, Calendar, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationsDropdownProps {
  className?: string;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ className }) => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    isLoading 
  } = useNotifications();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, h:mm a');
  };

  const recentNotifications = notifications.slice(0, 5);

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "booking":
        return <Calendar className="h-4 w-4 text-green-500" />;
      case "contact_form":
        return <PhoneCall className="h-4 w-4 text-purple-500" />;
      case "task":
        return <Check className="h-4 w-4 text-orange-500" />;
      case "event":
        return <Calendar className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Handle notification click to navigate to related entity
  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type and related entity
    if (notification.related_entity_id && notification.related_entity_type) {
      switch (notification.type) {
        case "message":
          navigate(`/dashboard/messages`);
          break;
        case "booking":
          navigate(`/dashboard/bookings`);
          break;
        case "contact_form":
          navigate(`/dashboard/business-page`);
          break;
        case "task":
          navigate(`/dashboard/tasks`);
          break;
        case "event":
          navigate(`/dashboard/events`);
          break;
        default:
          navigate('/dashboard/notifications');
          break;
      }
    } else {
      navigate('/dashboard/notifications');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${className}`}>
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
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsRead()}
              className="h-8 text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="max-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : recentNotifications.length > 0 ? (
            <div className="divide-y">
              {recentNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 flex gap-2 items-start hover:bg-muted/50 cursor-pointer ${
                    !notification.is_read ? 'bg-muted/30' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{notification.title}</span>
                      <span className="text-xs text-muted-foreground mt-1">{notification.content}</span>
                      <span className="text-xs text-muted-foreground mt-1">{formatDate(notification.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-2 h-2 rounded-full ${!notification.is_read ? 'bg-wakti-blue' : 'bg-muted'}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </ScrollArea>
        
        <div className="border-t p-3">
          <Button 
            variant="ghost" 
            className="w-full justify-between" 
            onClick={() => navigate('/dashboard/notifications')}
          >
            View all notifications
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsDropdown;
