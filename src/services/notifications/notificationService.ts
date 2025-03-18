
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { fromTable } from "@/integrations/supabase/helper";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Notification {
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

let notificationChannel: RealtimeChannel | null = null;

/**
 * Fetches notifications for the current user
 */
export const fetchNotifications = async (limit = 20, offset = 0) => {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id;

  if (!userId) {
    return { data: null, error: new Error("No authenticated user") };
  }

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data: notifications, error };
};

/**
 * Fetches unread notifications count
 */
export const fetchUnreadNotificationsCount = async () => {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id;

  if (!userId) {
    return 0;
  }

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error("Error fetching unread notifications count:", error);
    return 0;
  }

  return count || 0;
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  return { success: !error, error };
};

/**
 * Marks all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id;

  if (!userId) {
    return { success: false, error: new Error("No authenticated user") };
  }

  // Using the database function we created
  const { data: result, error } = await supabase
    .rpc('mark_all_notifications_as_read', { p_user_id: userId });

  return { success: !error && !!result, error };
};

/**
 * Deletes a notification
 */
export const deleteNotification = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  return { success: !error, error };
};

/**
 * Creates a new notification
 */
export const createNotification = async (
  userId: string,
  title: string,
  content: string,
  type: string,
  relatedEntityId?: string,
  relatedEntityType?: string
) => {
  // Using the database function we created
  const { data, error } = await supabase
    .rpc('create_notification', {
      p_user_id: userId,
      p_title: title,
      p_content: content,
      p_type: type,
      p_related_entity_id: relatedEntityId,
      p_related_entity_type: relatedEntityType
    });

  return { data, error };
};

/**
 * Subscribe to notification updates for the current user
 */
export const subscribeToNotifications = (
  onNewNotification: (notification: Notification) => void
) => {
  // Unsubscribe from any existing channel
  if (notificationChannel) {
    supabase.removeChannel(notificationChannel);
  }

  // Get the current user
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session?.user) return;

    notificationChannel = supabase
      .channel('notifications-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${session.user.id}`
        },
        (payload) => {
          // Call the callback with the new notification
          const notification = payload.new as Notification;
          onNewNotification(notification);

          // Show a toast notification
          toast({
            title: notification.title,
            description: notification.content,
            duration: 5000,
          });
        }
      )
      .subscribe();
  });

  // Return function to unsubscribe
  return () => {
    if (notificationChannel) {
      supabase.removeChannel(notificationChannel);
      notificationChannel = null;
    }
  };
};
