
import { useEffect } from "react";
import { subscribeToNotifications, Notification } from "@/services/notifications/notificationService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const NotificationListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    try {
      const handleNewNotification = (notification: Notification) => {
        // Invalidate queries to refresh notification data
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
      };

      // Subscribe to notifications
      const unsubscribe = subscribeToNotifications(handleNewNotification);
      
      // Cleanup subscription when component unmounts
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error in notification listener:", error);
      toast({
        title: "Notification System Error",
        description: "Could not connect to notification service",
        variant: "destructive",
      });
    }
  }, [queryClient]);

  // This component doesn't render anything
  return null;
};

export default NotificationListener;
