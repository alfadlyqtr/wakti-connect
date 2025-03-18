
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  subscribeToNotifications,
  Notification
} from "@/services/notifications/notificationService";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const [showToast, setShowToast] = useState(true);

  // Fetch all notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await fetchNotifications();
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch unread count
  const {
    data: unreadCount = 0,
    isLoading: isLoadingUnread,
  } = useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: async () => {
      return await fetchUnreadNotificationsCount();
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
    },
  });

  // Handle marking a notification as read
  const handleMarkAsRead = useCallback((id: string) => {
    markAsReadMutation.mutate(id);
  }, [markAsReadMutation]);

  // Handle marking all notifications as read
  const handleMarkAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  // Handle deleting a notification
  const handleDeleteNotification = useCallback((id: string) => {
    deleteNotificationMutation.mutate(id);
  }, [deleteNotificationMutation]);

  // Subscribe to real-time notifications
  useEffect(() => {
    // Only subscribe if we want to show toast notifications
    if (!showToast) return;

    const handleNewNotification = (notification: Notification) => {
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
    };

    const unsubscribe = subscribeToNotifications(handleNewNotification);
    
    return () => {
      unsubscribe();
    };
  }, [queryClient, showToast]);

  // Toggle toast notifications on/off
  const toggleNotificationToasts = useCallback(() => {
    setShowToast(prev => !prev);
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    isLoadingUnread,
    error,
    showToast,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    toggleNotificationToasts,
    refetchNotifications: refetch
  };
};
