
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Staff, WorkSession } from "@/hooks/useStaffData";

export interface StaffWithSessions extends Staff {
  sessions: WorkSession[];
}

export const useStaffWorkLogs = () => {
  return useQuery({
    queryKey: ['staffWorkLogs'],
    queryFn: async () => {
      try {
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('*');
        
        if (staffError) {
          throw staffError;
        }

        // Transform staff data into the format we need
        const staffMembers: Staff[] = staffData.map(staff => {
          return {
            id: staff.id,
            name: staff.name || 'Unnamed Staff',
            role: staff.role || 'staff',
            email: staff.email || ''
          };
        });
        
        // For each staff member, get their work sessions
        const staffWithSessions: StaffWithSessions[] = [];
        
        for (const staff of staffMembers) {
          const { data: sessions, error: sessionsError } = await supabase
            .from('staff_work_logs')
            .select('*')
            .eq('staff_relation_id', staff.id);
              
          if (sessionsError) {
            console.error(`Error fetching sessions for staff ${staff.id}:`, sessionsError);
            toast({
              title: "Error fetching work logs",
              description: sessionsError.message,
              variant: "destructive"
            });
          }
            
          // Transform the sessions to include a date field and ensure correct status type
          const formattedSessions = (sessions || []).map(session => {
            // Ensure the status is one of the valid options
            let typedStatus: 'active' | 'completed' | 'cancelled' = 'active';
            if (session.status === 'completed') typedStatus = 'completed';
            if (session.status === 'cancelled') typedStatus = 'cancelled';
              
            return {
              ...session,
              date: new Date(session.start_time).toISOString().split('T')[0],
              status: typedStatus
            } as WorkSession;
          });
            
          staffWithSessions.push({
            ...staff,
            sessions: formattedSessions
          });
        }
        
        return staffWithSessions;
      } catch (error) {
        console.error("Error in staffWorkLogs query:", error);
        toast({
          title: "Error loading staff work logs",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
        return [];
      }
    }
  });
};
