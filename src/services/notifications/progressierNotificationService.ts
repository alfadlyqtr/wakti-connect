
import { Notification } from "./notificationService";
import { 
  sendPushNotification, 
  getNotificationUrl, 
  formatNotificationContent 
} from "@/utils/progressierNotifications";

/**
 * Process a notification and send a push notification via Progressier
 */
export const processNotificationForProgressier = async (notification: Notification): Promise<boolean> => {
  try {
    // Format the notification content
    const { title, body } = formatNotificationContent(
      notification.type,
      notification.title,
      notification.content
    );
    
    // Get the URL to navigate to when the notification is clicked
    const url = getNotificationUrl(notification.type, notification.related_entity_id || undefined);
    
    // Send the push notification
    return await sendPushNotification(
      title,
      body,
      url,
      undefined, // icon
      notification.type, // tag
      { 
        id: notification.id,
        type: notification.type,
        entityId: notification.related_entity_id
      }
    );
  } catch (error) {
    console.error('Error processing notification for Progressier:', error);
    return false;
  }
};

/**
 * Determine if a notification should trigger a push notification
 */
export const shouldSendPushNotification = (notification: Notification): boolean => {
  // Don't send push notifications for certain types if needed
  // const excludedTypes = [];
  // if (excludedTypes.includes(notification.type)) return false;
  
  return true;
};
