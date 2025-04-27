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
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return { data: null, error: new Error("No authenticated user") };
  }

  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { 
      data: notifications?.filter(n => n !== null) || [], 
      error: null 
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { data: [], error };
  }
};

/**
 * Fetches unread notifications count
 */
export const fetchUnreadNotificationsCount = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

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
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: new Error("No authenticated user") };
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  return { success: !error, error };
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
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title: title,
      content: content,
      type: type,
      related_entity_id: relatedEntityId,
      related_entity_type: relatedEntityType,
      is_read: false
    })
    .select('id')
    .single();

  return { data, error };
};

/**
 * Show a browser notification
 */
const showBrowserNotification = (title: string, content: string) => {
  if (!("Notification" in window)) return;
  
  const browserNotificationsEnabled = localStorage.getItem("browserNotificationsEnabled");
  if (browserNotificationsEnabled !== "true") return;
  
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: content,
      icon: "/favicon.ico"
    });
  }
};

/**
 * Subscribe to notification updates for the current user
 */
export const subscribeToNotifications = (
  onNewNotification: (notification: Notification) => void
) => {
  if (notificationChannel) {
    supabase.removeChannel(notificationChannel);
  }

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
          const notification = payload.new as Notification;
          onNewNotification(notification);

          showBrowserNotification(notification.title, notification.content);
          
          toast({
            title: notification.title,
            description: notification.content,
            duration: 5000,
          });
        }
      )
      .subscribe();
  });

  return () => {
    if (notificationChannel) {
      supabase.removeChannel(notificationChannel);
      notificationChannel = null;
    }
  };
};
