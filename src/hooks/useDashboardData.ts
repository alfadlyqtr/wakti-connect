
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
  const { data: profileData, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
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
      } catch (error: any) {
        console.error("Error in profile data fetching:", error);
        return null;
      }
    },
    retry: 2,
  });

  // Fetch today's tasks
  const { data: todayTasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['todayTasks'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          return [];
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
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error("Error in tasks fetching:", error);
        return [];
      }
    },
    enabled: !!profileData,
  });

  // Fetch unread notifications count
  const { data: unreadNotifications, isLoading: notificationsLoading, error: notificationsError } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          return [];
        }
        
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_read', false);
        
        if (error) {
          // If the error is because the table doesn't exist, just return empty array
          if (error.code === 'PGRST116') {
            return [];
          }
          console.error("Error fetching unread notifications:", error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error("Error in notifications fetching:", error);
        return [];
      }
    },
    enabled: !!profileData,
  });

  // Check for errors and display toast notifications if needed
  if (profileError && !profileLoading) {
    toast({
      title: "Profile Error",
      description: "Unable to load your profile data",
      variant: "destructive",
    });
  }

  return {
    profileData,
    todayTasks,
    unreadNotifications,
    isLoading: profileLoading || tasksLoading || notificationsLoading,
    hasError: !!profileError || !!tasksError || !!notificationsError,
  };
};
