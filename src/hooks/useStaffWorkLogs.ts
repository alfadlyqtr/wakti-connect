
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

export const useStaffWorkLogs = () => {
  return useQuery({
    queryKey: ['staffWorkLogs'],
    queryFn: async () => {
      try {
        // Fetch all staff members
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('*');
          
        if (staffError) throw staffError;
        
        // Fetch all work logs
        const { data: logsData, error: logsError } = await supabase
          .from('staff_work_logs')
          .select('*')
          .order('start_time', { ascending: false });
          
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
