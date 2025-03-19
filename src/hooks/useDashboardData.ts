
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

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
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Only fetch profile data if authenticated
  const { data: profileData, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        console.log("useDashboardData: Fetching user profile data for user:", user?.id);
        
        if (!user?.id) {
          console.error("useDashboardData: No active user found when fetching profile data");
          return null;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, account_type, display_name, business_name, occupation, avatar_url, theme_preference')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("useDashboardData: Error fetching profile data:", error);
          throw error;
        }
        
        console.log("useDashboardData: Profile data successfully retrieved:", data);
        return data as ProfileData;
      } catch (error: any) {
        console.error("useDashboardData: Error in profile data fetching:", error);
        return null;
      }
    },
    retry: 2,
    staleTime: 300000, // 5 minutes
    enabled: isAuthenticated && !authLoading && !!user?.id, // Only run query if authenticated and user exists
  });

  // Fetch today's tasks only if we have a profile
  const { data: todayTasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['todayTasks'],
    queryFn: async () => {
      try {
        console.log("useDashboardData: Fetching today's tasks for user:", user?.id);
        
        if (!user?.id) {
          console.warn("useDashboardData: No active user found when fetching today's tasks");
          return [];
        }
        
        // Get today's date range
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        
        console.log("useDashboardData: Date range for today's tasks:", {
          startOfDay: startOfDay.toISOString(),
          endOfDay: endOfDay.toISOString()
        });
        
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .gte('due_date', startOfDay.toISOString())
          .lte('due_date', endOfDay.toISOString());
        
        if (error) {
          console.error("useDashboardData: Error fetching today's tasks:", error);
          // Return empty array instead of throwing for non-critical data
          return [];
        }
        
        console.log(`useDashboardData: Retrieved ${data?.length || 0} tasks for today`);
        return data || [];
      } catch (error) {
        console.error("useDashboardData: Error in tasks fetching:", error);
        return [];
      }
    },
    enabled: !!profileData && !!user?.id, // Only run if we have the profile and user
    staleTime: 60000, // 1 minute
  });

  // Fetch unread notifications count only if we have a profile
  const { data: unreadNotifications, isLoading: notificationsLoading, error: notificationsError } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      try {
        console.log("useDashboardData: Fetching unread notifications for user:", user?.id);
        
        if (!user?.id) {
          console.warn("useDashboardData: No active user found when fetching notifications");
          return [];
        }
        
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_read', false);
        
        if (error) {
          // If the error is because the table doesn't exist, just return empty array
          if (error.code === 'PGRST116') {
            console.log("useDashboardData: Notifications table might not exist yet");
            return [];
          }
          console.error("useDashboardData: Error fetching unread notifications:", error);
          return [];
        }
        
        console.log(`useDashboardData: Retrieved ${data?.length || 0} unread notifications`);
        return data || [];
      } catch (error) {
        console.error("useDashboardData: Error in notifications fetching:", error);
        return [];
      }
    },
    enabled: !!profileData && !!user?.id, // Only run if we have the profile and user
    staleTime: 60000, // 1 minute
  });

  // Check for errors and display toast notifications if needed
  if (profileError && !profileLoading && !authLoading) {
    console.error("useDashboardData: Profile data error:", profileError);
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
    isLoading: authLoading || profileLoading, // Consider loading if auth or profile is loading
    tasksLoading,
    notificationsLoading,
    hasError: !!profileError || !!tasksError || !!notificationsError,
  };
};
