
import { useEffect } from "react";
import { subscribeToNotifications, Notification } from "@/services/notifications/notificationService";
import { useQueryClient } from "@tanstack/react-query";

const NotificationListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
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
  }, [queryClient]);

  // This component doesn't render anything
  return null;
};

export default NotificationListener;
