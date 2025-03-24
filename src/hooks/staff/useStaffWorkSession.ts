
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WorkSession {
  id: string;
  start_time: string;
  end_time: string | null;
  status: 'active' | 'completed' | 'cancelled';
  earnings: number;
  notes?: string;
}

export const useStaffWorkingStatus = (staffRelationId?: string) => {
  // Skip query if no staff relation ID is provided
  const enabled = !!staffRelationId;
  
  const { 
    data: workSession, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['staffWorkSession', staffRelationId],
    queryFn: async () => {
      if (!staffRelationId) return null;
      
      // Try to fetch the active work session for this staff member
      const { data, error } = await supabase
        .from('staff_work_logs')
        .select('*')
        .eq('staff_relation_id', staffRelationId)
        .is('end_time', null)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching work session:", error);
        throw error;
      }
      
      return data as WorkSession | null;
    },
    enabled,
    refetchInterval: 60000, // Refetch every minute to keep status up to date
  });

  return {
    workSession,
    isLoading,
    error,
    isClockingIn: false, // For future implementation of clock in/out functionality
  };
};
