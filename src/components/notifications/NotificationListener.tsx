
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
        
        // Handle different types of notifications
        switch (notification.type) {
          case 'booking':
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast({
              title: "New Booking",
              description: notification.content,
              duration: 5000,
            });
            break;
          
          case 'message':
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            toast({
              title: "New Message",
              description: notification.content,
              duration: 5000,
            });
            break;
          
          case 'contact_form':
            queryClient.invalidateQueries({ queryKey: ['contactSubmissions'] });
            toast({
              title: "New Contact Form Submission",
              description: notification.content,
              duration: 5000,
            });
            break;
            
          case 'task':
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast({
              title: "Task Update",
              description: notification.content,
              duration: 5000,
            });
            break;
            
          case 'event':
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast({
              title: "Event Update",
              description: notification.content,
              duration: 5000,
            });
            break;
            
          default:
            // Generic notification
            toast({
              title: notification.title,
              description: notification.content,
              duration: 5000,
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
