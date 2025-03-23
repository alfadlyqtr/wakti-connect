
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getStaffRelationId } from "@/utils/staffUtils";

export const useStaffWorkingStatus = () => {
  return useQuery({
    queryKey: ['staffWorkingStatus'],
    queryFn: async () => {
      try {
        // Get the staff relation ID for the current user
        const staffRelationId = await getStaffRelationId();
        
        if (!staffRelationId) {
          return { isWorking: false };
        }
        
        // Check if staff has an active work session
        const { data, error } = await supabase
          .from('staff_work_logs')
          .select('id')
          .eq('staff_relation_id', staffRelationId)
          .is('end_time', null)
          .eq('status', 'active')
          .maybeSingle();
          
        if (error) {
          console.error("Error checking staff working status:", error);
          return { isWorking: false };
        }
        
        return { isWorking: !!data };
      } catch (error) {
        console.error("Error in staff working status:", error);
        return { isWorking: false };
      }
    },
    refetchInterval: 60000, // Refresh status every minute
  });
};
