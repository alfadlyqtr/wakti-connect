
import React, { useState } from "react";
import { Bell, Trash2, Check, Clock, Loader2, MessageSquare, User, Calendar, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// Define Notification type based on our database schema
interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  related_entity_id: string | null;
  related_entity_type: string | null;
  created_at: string;
}

const DashboardNotifications = () => {
  const navigate = useNavigate();
  
  // Fetch notifications with React Query
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Fetch user's account type
      const { data: profileData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
      
      // Fetch notifications
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
        
      return {
        notifications: data as Notification[],
        userRole: profileData?.account_type || "free"
      };
    },
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Show error toast if query fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load notifications",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }, [error]);

  const userRole = notificationsData?.userRole || "free";
  const notifications = notificationsData?.notifications || [];
  const isPaidAccount = userRole === "individual" || userRole === "business";

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refetch notifications
      refetch();
      
      toast({
        title: "Notification marked as read",
        description: "The notification has been marked as read",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update notification",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refetch notifications
      refetch();
      
      toast({
        title: "Notification deleted",
        description: "The notification has been removed",
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete notification",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle notification click to navigate to related entity
  const handleNotificationClick = (notification: Notification) => {
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
          // Default to notifications page
          break;
      }
    }
  };

  // Format notification date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />;
      case "booking":
        return <Calendar className="h-4 w-4 mr-2 text-green-500" />;
      case "contact_form":
        return <PhoneCall className="h-4 w-4 mr-2 text-purple-500" />;
      case "task":
        return <Check className="h-4 w-4 mr-2 text-orange-500" />;
      case "event":
        return <Calendar className="h-4 w-4 mr-2 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  // Notification card component
  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card 
      key={notification.id} 
      className={cn(
        "mb-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
        notification.is_read ? "opacity-75" : ""
      )}
      onClick={() => handleNotificationClick(notification)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "inline-block w-2 h-2 rounded-full",
                notification.is_read ? "bg-muted" : "bg-wakti-blue"
              )}></span>
              <div className="flex items-center">
                {getNotificationIcon(notification.type)}
                <h4 className="font-medium text-base">{notification.title}</h4>
              </div>
              {!notification.is_read && (
                <Badge variant="outline" className="bg-wakti-blue/10 text-wakti-blue text-xs">
                  New
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{notification.content}</p>
            <p className="text-xs text-muted-foreground">{formatDate(notification.created_at)}</p>
          </div>
          <div className="flex gap-1 ml-2">
            {!notification.is_read && isPaidAccount && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(notification.id);
                }}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Mark as read</span>
              </Button>
            )}
            {isPaidAccount && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with important alerts and notifications.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
            <span className="ml-2">Loading notifications...</span>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (notifications.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with important alerts and notifications.
          </p>
        </div>
        
        {isPaidAccount ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-col items-center justify-center space-y-3 py-12">
                <Bell className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No notifications</h3>
                <p className="text-center text-sm text-muted-foreground max-w-xs">
                  You're all caught up! No new notifications at this time.
                </p>
              </div>
            </div>
          </Tabs>
        ) : (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-col items-center justify-center space-y-3 py-12">
              <Bell className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No notifications</h3>
              <p className="text-center text-sm text-muted-foreground max-w-xs">
                You're all caught up! No new notifications at this time.
              </p>
              {userRole === "free" && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                  View Only
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with important alerts and notifications.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 mb-4">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Read ({readNotifications.length})
          </TabsTrigger>
        </TabsList>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <TabsContent value="all">
            {notifications.map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </TabsContent>
          
          <TabsContent value="unread">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3 py-12">
                <Check className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No unread notifications</h3>
                <p className="text-center text-sm text-muted-foreground max-w-xs">
                  You're all caught up! You have no unread notifications.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="read">
            {readNotifications.length > 0 ? (
              readNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3 py-12">
                <Clock className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No read notifications</h3>
                <p className="text-center text-sm text-muted-foreground max-w-xs">
                  You haven't read any notifications yet.
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DashboardNotifications;
