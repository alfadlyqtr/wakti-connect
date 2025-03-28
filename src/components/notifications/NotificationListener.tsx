
import { useEffect } from "react";
import { subscribeToNotifications, Notification } from "@/services/notifications/notificationService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const NotificationListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    try {
      const handleNewNotification = (notification: Notification) => {
        // Invalidate queries to refresh notification data
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
        
        // Special handling for booking notifications
        if (notification.type === 'booking') {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
          
          // Show a more prominent toast for booking notifications
          toast({
            title: "New Booking Received!",
            description: notification.content,
            duration: 8000,
            variant: "success"
          });
        }
      };

      // Subscribe to notifications
      unsubscribe = subscribeToNotifications(handleNewNotification);
    } catch (error) {
      console.error("Error in notification listener:", error);
      toast({
        title: "Notification System Error",
        description: "Could not connect to notification service. Notifications may not be real-time.",
        variant: "destructive",
      });
    }
    
    // Cleanup subscription when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [queryClient]);

  // This component doesn't render anything
  return null;
};

export default NotificationListener;
