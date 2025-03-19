
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
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      try {
        console.log("useDashboardData: Fetching user profile data for user:", user?.id);
        
        if (!user?.id) {
          console.error("useDashboardData: No active user found when fetching profile data");
          return null;
        }
        
        // Check if profiles table exists first
        try {
          const { data: testData, error: testError } = await supabase
            .from('profiles')
            .select('count(*)', { count: 'exact', head: true });
            
          if (testError && testError.code === 'PGRST116') {
            console.error("useDashboardData: Profiles table not found");
            return {
              full_name: user.name || null,
              account_type: "free" as const,
              display_name: user.displayName || null,
              business_name: null,
              occupation: null,
              avatar_url: null,
              theme_preference: "light"
            };
          }
        } catch (testError) {
          console.error("useDashboardData: Error testing profiles table:", testError);
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, account_type, display_name, business_name, occupation, avatar_url, theme_preference')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("useDashboardData: Error fetching profile data:", error);
          
          // If profile not found, create a fallback profile object
          if (error.code === 'PGRST116') {
            return {
              full_name: user.name || null,
              account_type: "free" as const,
              display_name: user.displayName || null,
              business_name: null,
              occupation: null,
              avatar_url: null,
              theme_preference: "light"
            };
          }
          
          throw error;
        }
        
        if (!data) {
          console.warn("useDashboardData: No profile data found, using defaults");
          return {
            full_name: user.name || null,
            account_type: "free" as const,
            display_name: user.displayName || null,
            business_name: null,
            occupation: null,
            avatar_url: null,
            theme_preference: "light"
          };
        }
        
        console.log("useDashboardData: Profile data successfully retrieved:", data);
        return data as ProfileData;
      } catch (error: any) {
        console.error("useDashboardData: Error in profile data fetching:", error);
        // Return fallback data instead of null to avoid UI errors
        return {
          full_name: user?.name || null,
          account_type: "free" as const,
          display_name: user?.displayName || null,
          business_name: null,
          occupation: null,
          avatar_url: null,
          theme_preference: "light"
        };
      }
    },
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2000 : 1000, 10000), // Exponential backoff
    staleTime: 300000, // 5 minutes
    enabled: isAuthenticated && !authLoading && !!user?.id, // Only run query if authenticated and user exists
  });

  // Fetch today's tasks only if we have authentication
  const { data: todayTasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['todayTasks', user?.id],
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
        
        // First, check if the tasks table exists
        try {
          const { data: testData, error: testError } = await supabase
            .from('tasks')
            .select('count(*)', { count: 'exact', head: true });
            
          if (testError && testError.code === 'PGRST116') {
            console.log("useDashboardData: Tasks table doesn't exist yet");
            return [];
          }
        } catch (testError) {
          console.error("useDashboardData: Error testing tasks table:", testError);
          return [];
        }
        
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .gte('due_date', startOfDay.toISOString())
          .lte('due_date', endOfDay.toISOString());
        
        if (error) {
          if (error.code === 'PGRST116') {
            console.log("useDashboardData: Tasks table might not exist yet");
            return [];
          }
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
    enabled: isAuthenticated && !!user?.id, // Only run if authenticated and user exists
    staleTime: 60000, // 1 minute
    retry: 2,
  });

  // Fetch unread notifications only if we have authentication
  const { data: unreadNotifications, isLoading: notificationsLoading, error: notificationsError } = useQuery({
    queryKey: ['unreadNotifications', user?.id],
    queryFn: async () => {
      try {
        console.log("useDashboardData: Fetching unread notifications for user:", user?.id);
        
        if (!user?.id) {
          console.warn("useDashboardData: No active user found when fetching notifications");
          return [];
        }
        
        // Check if notifications table exists
        try {
          const { data: testData, error: testError } = await supabase
            .from('notifications')
            .select('count(*)', { count: 'exact', head: true });
            
          if (testError && testError.code === 'PGRST116') {
            console.log("useDashboardData: Notifications table doesn't exist yet");
            return [];
          }
        } catch (testError) {
          console.error("useDashboardData: Error testing notifications table:", testError);
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
    enabled: isAuthenticated && !!user?.id, // Only run if authenticated and user exists
    staleTime: 60000, // 1 minute
    retry: 2,
  });

  return {
    profileData,
    todayTasks,
    unreadNotifications,
    isLoading: authLoading || (profileLoading && isAuthenticated), // Consider loading if auth or profile is loading
    tasksLoading,
    notificationsLoading,
    hasError: !!profileError || !!tasksError || !!notificationsError,
  };
};
