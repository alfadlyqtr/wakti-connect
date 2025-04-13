
/**
 * Utility to handle Progressier push notifications integration
 * This connects our existing notification system with Progressier
 * for native browser/mobile system push alerts
 */

// Check if Progressier is available
const isProgressierAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'progressier' in window;
};

// Check if notifications are supported and permissions granted
const areNotificationsGranted = async (): Promise<boolean> => {
  if (!isProgressierAvailable()) return false;
  
  try {
    // @ts-ignore - Progressier is loaded via external script
    return await window.progressier.isPushNotificationsGranted();
  } catch (error) {
    console.error('Error checking Progressier notification permissions:', error);
    return false;
  }
};

// Request notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isProgressierAvailable()) {
    console.warn('Progressier not available for requesting push notification permission');
    return false;
  }
  
  try {
    // @ts-ignore - Progressier is loaded via external script
    return await window.progressier.askPushNotificationsPermission();
  } catch (error) {
    console.error('Error requesting Progressier notification permission:', error);
    return false;
  }
};

// Send a push notification via Progressier
export const sendPushNotification = async (
  title: string, 
  body: string, 
  url: string = window.location.origin,
  icon?: string,
  tag?: string,
  data?: Record<string, any>
): Promise<boolean> => {
  if (!isProgressierAvailable()) {
    console.warn('Progressier not available for sending push notification');
    return false;
  }
  
  try {
    // @ts-ignore - Progressier is loaded via external script
    await window.progressier.sendPushNotification({
      title,
      body,
      url,
      icon,
      tag,
      data
    });
    return true;
  } catch (error) {
    console.error('Error sending Progressier push notification:', error);
    return false;
  }
};

// Check if user has granted notification permissions and request if not
export const ensureNotificationPermission = async (): Promise<boolean> => {
  if (await areNotificationsGranted()) {
    return true;
  }
  
  return await requestNotificationPermission();
};

// Format URLs for navigation when notification is clicked
export const getNotificationUrl = (type: string, entityId?: string): string => {
  const baseUrl = window.location.origin;
  
  switch (type) {
    case 'task':
      return `${baseUrl}/dashboard/tasks?id=${entityId}`;
    case 'message':
      return `${baseUrl}/dashboard/messages?contact=${entityId}`;
    case 'contact':
      return `${baseUrl}/dashboard/contacts`;
    case 'booking':
      return `${baseUrl}/dashboard/bookings?id=${entityId}`;
    case 'job_card':
      return `${baseUrl}/dashboard/job-cards`;
    case 'event':
      return `${baseUrl}/dashboard/events?id=${entityId}`;
    case 'subscriber':
      return `${baseUrl}/dashboard/business/subscribers`;
    default:
      return baseUrl;
  }
};

// Generate notification title and message based on type
export const formatNotificationContent = (
  type: string, 
  title: string, 
  content: string
): { title: string, body: string } => {
  switch (type) {
    case 'task_reminder':
      return {
        title: 'Task Reminder',
        body: content || title
      };
    case 'task_due':
      return {
        title: 'Task Due Soon',
        body: content || title
      };
    case 'message':
      return {
        title: 'New Message',
        body: content || 'You have received a new message'
      };
    case 'contact_request':
      return {
        title: 'Contact Request',
        body: content || 'You have a new contact request'
      };
    case 'contact_approved':
      return {
        title: 'Contact Approved',
        body: content || 'Your contact request was approved'
      };
    case 'booking':
      return {
        title: 'New Booking',
        body: content || 'You have a new booking'
      };
    case 'job_card':
      return {
        title: 'Job Card Update',
        body: content || title
      };
    case 'event':
      return {
        title: 'Event Update',
        body: content || title
      };
    case 'subscriber':
      return {
        title: 'New Subscriber',
        body: content || 'Someone has subscribed to your business'
      };
    default:
      return {
        title: title || 'WAKTI Notification',
        body: content || 'You have a new notification'
      };
  }
};
