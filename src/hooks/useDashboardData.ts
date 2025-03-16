import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define proper type for the profile data
interface ProfileData {
  full_name: string | null;
  account_type: "free" | "individual" | "business";
  display_name: string | null;
  business_name: string | null;
  occupation: string | null;
  avatar_url: string | null;
  theme_preference: string | null;
}

export const useDashboardData = () => {
  // Fetch user profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, account_type, display_name, business_name, occupation, avatar_url, theme_preference')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      return data as ProfileData;
    },
  });

  // Fetch today's tasks
  const { data: todayTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['todayTasks'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Get today's date range
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('due_date', startOfDay.toISOString())
        .lte('due_date', endOfDay.toISOString());
      
      if (error) {
        console.error("Error fetching today's tasks:", error);
        throw error;
      }
      
      return data;
    },
  });

  // Fetch upcoming appointments
  const { data: upcomingAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Get current time
      const now = new Date();
      
      // Get future appointments (next 7 days)
      const sevenDaysLater = new Date(now);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('start_time', now.toISOString())
        .lte('start_time', sevenDaysLater.toISOString())
        .order('start_time', { ascending: true });
      
      if (error) {
        console.error("Error fetching upcoming appointments:", error);
        throw error;
      }
      
      return data;
    },
  });

  // Fetch unread notifications count
  const { data: unreadNotifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_read', false);
      
      if (error) {
        console.error("Error fetching unread notifications:", error);
        throw error;
      }
      
      return data;
    },
  });

  return {
    profileData,
    todayTasks,
    upcomingAppointments,
    unreadNotifications,
    isLoading: profileLoading || tasksLoading || appointmentsLoading || notificationsLoading
  };
};
