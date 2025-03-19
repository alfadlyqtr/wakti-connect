
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StaffWorkLog {
  id: string;
  staff_relation_id: string;
  start_time: string;
  end_time: string | null;
  earnings: number | null;
  notes: string | null;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface StaffWithSessions {
  id: string;
  name: string;
  role: string;
  sessions: StaffWorkLog[];
}

export const useStaffWorkLogs = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ['staffWorkLogs', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      try {
        // Fetch all staff members
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('*');
          
        if (staffError) throw staffError;
        
        // Build the query for work logs
        let query = supabase
          .from('staff_work_logs')
          .select('*');
        
        // Add date filters if provided
        if (startDate) {
          query = query.gte('start_time', startDate.toISOString());
        }
        
        if (endDate) {
          // Set end date to end of day
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          query = query.lte('start_time', endOfDay.toISOString());
        }
        
        // Execute the query with ordering
        const { data: logsData, error: logsError } = await query.order('start_time', { ascending: false });
          
        if (logsError) throw logsError;
        
        // Map staff with their sessions
        const staffWithSessions: StaffWithSessions[] = staffData.map(staff => {
          const staffLogs = logsData.filter(log => log.staff_relation_id === staff.id);
          
          return {
            id: staff.id,
            name: staff.name || 'Unnamed Staff',
            role: staff.role || 'staff',
            sessions: staffLogs.map(log => ({
              ...log,
              status: (log.status as 'active' | 'completed' | 'cancelled') || 'active'
            }))
          };
        });
        
        return staffWithSessions;
      } catch (error) {
        console.error("Error fetching staff work logs:", error);
        return [];
      }
    }
  });
};
