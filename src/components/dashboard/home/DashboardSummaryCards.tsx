
import React from "react";
import { Bell, CheckCircle, Users, Calendar } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardNotifications } from "@/hooks/useDashboardNotifications";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardSummaryCardsProps {
  todayTasks: any[] | undefined;
  isLoading?: boolean;
}

export const DashboardSummaryCards = ({
  todayTasks = [],
  isLoading = false,
}: DashboardSummaryCardsProps) => {
  const tasks = todayTasks || [];
  const completedTasksCount = tasks.filter((task: any) => task.status === "completed").length;
  const { unreadCount, isLoading: notificationsLoading } = useDashboardNotifications();

  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ['dashboardContactsCount'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { contactsCount: 0 };
      
      console.log("[DashboardSummaryCards] Fetching regular contacts count for user:", session.user.id);
      
      // Only count regular contacts (excluding staff contacts)
      const { count, error } = await supabase
        .from('user_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('status', 'accepted')
        .is('staff_relation_id', null);
      
      if (error) {
        console.error("[DashboardSummaryCards] Error fetching contacts count:", error);
        return { contactsCount: 0 };
      }
      
      console.log("[DashboardSummaryCards] Regular contacts count:", count);
      return { contactsCount: count || 0 };
    }
  });

  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['dashboardUpcomingEvents'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { eventsCount: 0 };
      
      // Get today's date at the beginning of the day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get date 7 days from now at the end of the day
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      nextWeek.setHours(23, 59, 59, 999);
      
      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('start_date', today.toISOString())
        .lte('start_date', nextWeek.toISOString());
      
      if (error) {
        console.error("Error fetching upcoming events:", error);
        return { eventsCount: 0 };
      }
      
      return { eventsCount: count || 0 };
    }
  });

  if (isLoading || contactsLoading || eventsLoading) {
    return (
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCard
            key={i}
            title=""
            value={<Skeleton className="h-8 w-24" />}
            icon={Users}
            gradient="purple"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
      <StatsCard
        title="Today's Tasks"
        value={tasks.length || 0}
        subtitle={tasks.length > 0 ? `${completedTasksCount} completed` : "No tasks for today"}
        icon={CheckCircle}
        iconColor="text-emerald-500"
        gradient="green"
      />

      <StatsCard
        title="Notifications"
        value={notificationsLoading ? <Skeleton className="h-6 w-12" /> : unreadCount}
        subtitle={unreadCount > 0 ? "Unread notifications" : "No new notifications"}
        icon={Bell}
        iconColor="text-amber-500"
        gradient="gold"
      />

      <StatsCard
        title="Upcoming Events"
        value={upcomingEvents?.eventsCount || 0}
        subtitle="Next 7 days"
        icon={Calendar}
        iconColor="text-indigo-500"
        gradient="purple"
      />

      <StatsCard
        title="Contacts"
        value={contactsData?.contactsCount || 0}
        subtitle="Regular contacts"
        icon={Users}
        iconColor="text-blue-500"
        gradient="blue"
      />
    </div>
  );
};
