
import { useQuery } from "@tanstack/react-query";
import { fetchUnreadNotificationsCount } from "@/services/notifications/notificationService";

// This hook fetches the unread notification count for the dashboard summary card.
export const useDashboardNotifications = () => {
  const { data: unreadCount = 0, isLoading } = useQuery({
    queryKey: ['dashboardUnreadNotificationsCount'],
    queryFn: fetchUnreadNotificationsCount,
  });

  return { unreadCount, isLoading };
};
