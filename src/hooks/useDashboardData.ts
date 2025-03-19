
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
        console.log("Fetching user profile data");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.error("No active session found when fetching profile data");
          throw new Error("No active session");
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, account_type, display_name, business_name, occupation, avatar_url, theme_preference')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile data:", error);
          throw error;
        }
        
        console.log("Profile data successfully retrieved");
        return data as ProfileData;
      } catch (error: any) {
        console.error("Error in profile data fetching:", error);
        return null;
      }
    },
    retry: 2,
    staleTime: 300000, // 5 minutes
  });

  // Fetch today's tasks only if we have a profile
  const { data: todayTasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['todayTasks'],
    queryFn: async () => {
      try {
        console.log("Fetching today's tasks");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.warn("No active session found when fetching today's tasks");
          return [];
        }
        
        // Get today's date range
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        
        console.log("Date range for today's tasks:", {
          startOfDay: startOfDay.toISOString(),
          endOfDay: endOfDay.toISOString()
        });
        
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', session.user.id)
          .gte('due_date', startOfDay.toISOString())
          .lte('due_date', endOfDay.toISOString());
        
        if (error) {
          console.error("Error fetching today's tasks:", error);
          // Return empty array instead of throwing for non-critical data
          return [];
        }
        
        console.log(`Retrieved ${data?.length || 0} tasks for today`);
        return data || [];
      } catch (error) {
        console.error("Error in tasks fetching:", error);
        return [];
      }
    },
    enabled: !!profileData, // Only run if we have the profile
    staleTime: 60000, // 1 minute
  });

  // Fetch unread notifications count only if we have a profile
  const { data: unreadNotifications, isLoading: notificationsLoading, error: notificationsError } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      try {
        console.log("Fetching unread notifications");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.warn("No active session found when fetching notifications");
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
            console.log("Notifications table might not exist yet");
            return [];
          }
          console.error("Error fetching unread notifications:", error);
          return [];
        }
        
        console.log(`Retrieved ${data?.length || 0} unread notifications`);
        return data || [];
      } catch (error) {
        console.error("Error in notifications fetching:", error);
        return [];
      }
    },
    enabled: !!profileData, // Only run if we have the profile
    staleTime: 60000, // 1 minute
  });

  // Check for errors and display toast notifications if needed
  if (profileError && !profileLoading) {
    console.error("Profile data error:", profileError);
    toast({
      title: "Profile Error",
      description: "Unable to load your profile data. Please refresh the page or try again later.",
      variant: "destructive",
    });
  }

  return {
    profileData,
    todayTasks,
    unreadNotifications,
    isLoading: profileLoading, // Only depend on profile loading
    tasksLoading,
    notificationsLoading,
    hasError: !!profileError || !!tasksError || !!notificationsError,
  };
};
