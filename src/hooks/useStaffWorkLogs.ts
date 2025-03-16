
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface WorkSession {
  id: string;
  staff_relation_id: string;
  start_time: string;
  end_time: string | null;
  date: string;
  earnings: number | null;
  notes: string | null;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface StaffWithSessions extends Staff {
  sessions: WorkSession[];
}

export const useStaffWorkLogs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['staffWithSessions'],
    queryFn: async () => {
      try {
        // First, get all business staff relationships
        const { data: staffRelations, error: staffError } = await supabase
          .from('business_staff')
          .select('id, staff_id, role, business_id')
          .throwOnError();
        
        if (staffError) {
          throw staffError;
        }

        // Get staff profile information
        const staffIds = staffRelations.map(relation => relation.staff_id);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', staffIds)
          .throwOnError();
        
        if (profilesError) {
          throw profilesError;
        }

        // Transform staff data into the format we need
        const staffMembers: Staff[] = staffRelations.map(relation => {
          const profile = profilesData.find(p => p.id === relation.staff_id);
          return {
            id: relation.staff_id,
            name: profile?.full_name || 'Unknown User',
            role: relation.role,
            email: ''  // We don't have direct access to email
          };
        });
        
        // For each staff member, get their work sessions
        const staffWithSessions: StaffWithSessions[] = [];
        
        for (const staff of staffMembers) {
          // Find the staff_relation_id
          const relation = staffRelations.find(r => r.staff_id === staff.id);
          
          if (relation) {
            const { data: sessions, error: sessionsError } = await supabase
              .from('staff_work_logs')
              .select('*')
              .eq('staff_relation_id', relation.id);
              
            if (sessionsError) {
              console.error(`Error fetching sessions for staff ${staff.id}:`, sessionsError);
              toast({
                title: "Error fetching work logs",
                description: sessionsError.message,
                variant: "destructive"
              });
            }
            
            // Transform the sessions to include a date field
            const formattedSessions = (sessions || []).map(session => {
              // Make sure to properly type the status field
              const typedStatus = (session.status as string || 'active') as 'active' | 'completed' | 'cancelled';
              
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
        }
        
        return staffWithSessions;
      } catch (error) {
        console.error("Error in staffWithSessions query:", error);
        toast({
          title: "Error loading staff data",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  // Add a new mutation to start a work session
  const startWorkSession = useMutation({
    mutationFn: async (staffRelationId: string) => {
      const { data, error } = await supabase
        .from('staff_work_logs')
        .insert({
          staff_relation_id: staffRelationId,
          start_time: new Date().toISOString(),
          status: 'active',
          earnings: 0
        })
        .select()
        .single();
        
      if (error) {
        toast({
          title: "Error starting work session",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Work session started",
        description: "Your work day has been started successfully",
      });
      
      // Add the date field
      const session = {
        ...data,
        date: new Date(data.start_time).toISOString().split('T')[0],
        status: data.status as 'active' | 'completed' | 'cancelled'
      } as WorkSession;
      
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffWithSessions'] });
    }
  });

  // Add a mutation to end a work session
  const endWorkSession = useMutation({
    mutationFn: async ({ sessionId, earnings, notes }: { sessionId: string, earnings?: number, notes?: string }) => {
      const { data, error } = await supabase
        .from('staff_work_logs')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          earnings: earnings || 0,
          notes: notes || ''
        })
        .eq('id', sessionId)
        .select()
        .single();
        
      if (error) {
        toast({
          title: "Error ending work session",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Work session ended",
        description: "Your work day has been ended successfully",
      });
      
      // Add the date field
      const session = {
        ...data,
        date: new Date(data.start_time).toISOString().split('T')[0],
        status: data.status as 'active' | 'completed' | 'cancelled'
      } as WorkSession;
      
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffWithSessions'] });
    }
  });

  return {
    ...query,
    startWorkSession,
    endWorkSession
  };
};
