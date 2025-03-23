
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StaffWorkSession {
  id: string;
  start_time: string;
  end_time?: string;
  status: string;
  earnings: number;
}

export interface StaffWithSessions {
  id: string;
  name: string;
  sessions?: StaffWorkSession[];
}

export const useStaffWorkLogs = () => {
  return useQuery({
    queryKey: ['staffWorkLogs'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // First, get all staff members for this business
      const { data: staffMembers, error: staffError } = await supabase
        .from('business_staff')
        .select('id, name, staff_id')
        .eq('business_id', session.session.user.id);
        
      if (staffError) throw staffError;
      
      // For each staff member, get their work logs
      const staffWithLogs: StaffWithSessions[] = [];
      
      for (const staff of staffMembers || []) {
        const { data: workLogs, error: logsError } = await supabase
          .from('staff_work_logs')
          .select('*')
          .eq('staff_relation_id', staff.id)
          .order('start_time', { ascending: false });
          
        if (logsError) {
          console.error(`Error fetching logs for staff ${staff.id}:`, logsError);
          continue;
        }
        
        staffWithLogs.push({
          id: staff.id,
          name: staff.name,
          sessions: workLogs as StaffWorkSession[] || []
        });
      }
      
      return staffWithLogs;
    }
  });
};
