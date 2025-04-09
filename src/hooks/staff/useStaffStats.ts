
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInSeconds, format } from "date-fns";

// Define a complete interface for staff stats
interface StaffStats {
  tasksCount: number;
  bookingsCount: number;
  workLogsCount: number;
  jobCardsCount: number;
  hoursWorked: number;
  hoursWorkedFormatted: string;
  activeBookings: number;
  isActiveSession: boolean;
  activeSessionStart: string | null;
  activeSessionDuration: string | null;
}

export const useStaffStats = (staffRelationId: string | null, userId: string | null) => {
  return useQuery<StaffStats, Error>({
    queryKey: ['staffStats', staffRelationId],
    queryFn: async () => {
      if (!staffRelationId || !userId) return {
        tasksCount: 0,
        bookingsCount: 0,
        workLogsCount: 0,
        jobCardsCount: 0,
        hoursWorked: 0,
        hoursWorkedFormatted: "0h 0m",
        activeBookings: 0,
        isActiveSession: false,
        activeSessionStart: null,
        activeSessionDuration: null
      };
      
      try {
        // Get tasks count
        const { count: tasksCount, error: tasksError } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        if (tasksError) throw tasksError;
        
        // Get bookings count and active bookings
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('id, status')
          .eq('staff_assigned_id', userId);
          
        if (bookingsError) throw bookingsError;
        
        const bookingsCount = bookings?.length || 0;
        const activeBookings = bookings?.filter(b => 
          b.status === 'confirmed' || b.status === 'pending'
        ).length || 0;
        
        // Get current active work session if exists
        const { data: activeSession, error: activeSessionError } = await supabase
          .from('staff_work_logs')
          .select('start_time')
          .eq('staff_relation_id', staffRelationId)
          .is('end_time', null)
          .eq('status', 'active')
          .maybeSingle();
          
        if (activeSessionError) throw activeSessionError;
        
        let activeSessionStart: string | null = null;
        let activeSessionDuration: string | null = null;
        let isActiveSession = false;
        
        if (activeSession) {
          isActiveSession = true;
          activeSessionStart = activeSession.start_time;
          const now = new Date();
          const startTime = new Date(activeSession.start_time);
          const activeSeconds = differenceInSeconds(now, startTime);
          
          // Format as HH:MM:SS
          const hours = Math.floor(activeSeconds / 3600);
          const minutes = Math.floor((activeSeconds % 3600) / 60);
          const seconds = Math.floor(activeSeconds % 60);
          activeSessionDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Get work logs and calculate total hours worked
        const { data: workLogs, error: workLogsError } = await supabase
          .from('staff_work_logs')
          .select('start_time, end_time')
          .eq('staff_relation_id', staffRelationId);
          
        if (workLogsError) throw workLogsError;
        
        // Calculate total hours worked this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        let totalSeconds = 0;
        
        workLogs?.forEach(log => {
          const startTime = new Date(log.start_time);
          
          // Only count logs from current month
          if (startTime >= startOfMonth) {
            // If end_time exists, use it for calculation, otherwise use current time for active sessions
            const endTime = log.end_time ? new Date(log.end_time) : now;
            totalSeconds += differenceInSeconds(endTime, startTime);
          }
        });
        
        // Convert seconds to hours (as a number for calculations)
        const hoursWorked = totalSeconds / 3600;
        
        // Format hours worked for display (hours and minutes)
        const hoursWorkedHours = Math.floor(hoursWorked);
        const hoursWorkedMinutes = Math.floor((hoursWorked - hoursWorkedHours) * 60);
        const hoursWorkedFormatted = `${hoursWorkedHours}h ${hoursWorkedMinutes}m`;
        
        // Get job cards count
        const { count: jobCardsCount, error: jobCardsError } = await supabase
          .from('job_cards')
          .select('*', { count: 'exact', head: true })
          .eq('staff_relation_id', staffRelationId);
          
        if (jobCardsError) throw jobCardsError;
        
        return {
          tasksCount: tasksCount || 0,
          bookingsCount: bookingsCount,
          workLogsCount: workLogs?.length || 0,
          jobCardsCount: jobCardsCount || 0,
          hoursWorked: hoursWorked,
          hoursWorkedFormatted: hoursWorkedFormatted,
          activeBookings: activeBookings,
          isActiveSession,
          activeSessionStart,
          activeSessionDuration
        };
      } catch (error) {
        console.error("Error fetching staff stats:", error);
        return {
          tasksCount: 0,
          bookingsCount: 0,
          workLogsCount: 0,
          jobCardsCount: 0,
          hoursWorked: 0,
          hoursWorkedFormatted: "0h 0m",
          activeBookings: 0,
          isActiveSession: false,
          activeSessionStart: null,
          activeSessionDuration: null
        };
      }
    },
    enabled: !!staffRelationId && !!userId,
    refetchInterval: 30000 // Refetch every 30 seconds to keep work time updated
  });
};
