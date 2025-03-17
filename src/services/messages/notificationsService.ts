
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the count of unread messages for the current user
 */
export const getUnreadMessagesCount = async (userId?: string) => {
  if (!userId) {
    const { data } = await supabase.auth.getSession();
    userId = data.session?.user?.id;
  }

  if (!userId) {
    return 0;
  }

  // Fix: Use the correct count syntax for Supabase
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error getting unread message count:', error);
    return 0;
  }

  return count || 0;
};

/**
 * Gets the latest notifications for the user
 */
export const getLatestNotifications = async (limit = 5) => {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id;

  if (!userId) {
    return [];
  }

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting notifications:', error);
    return [];
  }

  return notifications || [];
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true }) // Fixed: changed 'read' to 'is_read'
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }

  return true;
};

/**
 * Marks all notifications as read for the user
 */
export const markAllNotificationsAsRead = async () => {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id;

  if (!userId) {
    return false;
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true }) // Fixed: changed 'read' to 'is_read'
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }

  return true;
};
