
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBusinessAnalytics = (timeRange: "week" | "month" | "year") => {
  return useQuery({
    queryKey: ['businessAnalytics', timeRange],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // In a real application, this would fetch data from the backend
      // based on the selected time range
      return {
        subscriberCount: 157,
        appointmentCount: 352,
        staffCount: 5,
        taskCompletionRate: 87,
        timeRange
      };
    }
  });
};
