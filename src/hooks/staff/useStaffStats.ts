
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StaffStats {
  tasksCount: number;
  bookingsCount: number;
  workLogsCount: number;
  jobCardsCount: number;
}

export const useStaffStats = (staffRelationId: string | null, userId: string | null) => {
  return useQuery({
    queryKey: ['staffStats', staffRelationId],
    queryFn: async (): Promise<StaffStats> => {
      if (!staffRelationId || !userId) return {
        tasksCount: 0,
        bookingsCount: 0,
        workLogsCount: 0,
        jobCardsCount: 0
      };
      
      try {
        // Get tasks count
        const { count: tasksCount, error: tasksError } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('assignee_id', userId);
          
        if (tasksError) throw tasksError;
        
        // Get bookings count
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('staff_assigned_id', userId);
          
        if (bookingsError) throw bookingsError;
        
        // Get work logs count
        const { count: workLogsCount, error: workLogsError } = await supabase
          .from('staff_work_logs')
          .select('*', { count: 'exact', head: true })
          .eq('staff_relation_id', staffRelationId);
          
        if (workLogsError) throw workLogsError;
        
        // Get job cards count
        const { count: jobCardsCount, error: jobCardsError } = await supabase
          .from('job_cards')
          .select('*', { count: 'exact', head: true })
          .eq('staff_relation_id', staffRelationId);
          
        if (jobCardsError) throw jobCardsError;
        
        return {
          tasksCount: tasksCount || 0,
          bookingsCount: bookingsCount || 0,
          workLogsCount: workLogsCount || 0,
          jobCardsCount: jobCardsCount || 0
        };
      } catch (error) {
        console.error("Error fetching staff stats:", error);
        return {
          tasksCount: 0,
          bookingsCount: 0,
          workLogsCount: 0,
          jobCardsCount: 0
        };
      }
    },
    enabled: !!staffRelationId && !!userId
  });
};
