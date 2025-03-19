
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfileExists } from "@/services/profileService";

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
      console.log("Fetching profile data");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session, skipping profile fetch");
          throw new Error("No active session");
        }
        
        // First, ensure the profile exists
        const profileExists = await ensureProfileExists(session.user.id);
        
        if (!profileExists) {
          console.log("Failed to ensure profile exists");
          throw new Error("Failed to ensure profile exists");
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
        
        console.log("Successfully fetched profile data:", data);
        return data as ProfileData;
      } catch (error) {
        console.error("Error in profile data fetch:", error);
        throw error;
      }
    },
    retry: 2, // Retry a couple times in case of network issues
    refetchOnWindowFocus: false
  });

  // Fetch today's tasks
  const { data: todayTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['todayTasks'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session, skipping task fetch");
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
        console.error("Error in tasks fetch:", error);
        return [];
      }
    },
    enabled: !!profileData, // Only run this query if profile data is loaded
    retry: 1
  });

  // Fetch unread notifications count
  const { data: unreadNotifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session, skipping notifications fetch");
          return [];
        }
        
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_read', false);
        
        if (error) {
          console.error("Error fetching unread notifications:", error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error("Error in notifications fetch:", error);
        return [];
      }
    },
    enabled: !!profileData, // Only run this query if profile data is loaded
    retry: 1
  });

  return {
    profileData,
    todayTasks,
    unreadNotifications,
    isLoading: profileLoading || tasksLoading || notificationsLoading,
    error: profileError
  };
};
