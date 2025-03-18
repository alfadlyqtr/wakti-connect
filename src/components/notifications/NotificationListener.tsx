
import { useEffect } from "react";
import { subscribeToNotifications, Notification } from "@/services/notifications/notificationService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "@/components/ui/sonner";

const NotificationListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    try {
      const handleNewNotification = (notification: Notification) => {
        // Invalidate queries to refresh notification data
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
        
        // Also invalidate bookings query if it's a booking notification
        if (notification.type === "booking_created" || 
            notification.type === "booking_updated" || 
            notification.type === "booking_cancelled") {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
          
          // Show a sonner toast for booking notifications
          sonnerToast(notification.title, {
            description: notification.content,
            position: "top-right"
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
