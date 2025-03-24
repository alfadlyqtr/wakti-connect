
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkSession } from "@/hooks/useStaffData";

export const useWorkSessions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Add a new mutation to start a work session
  const startWorkSession = useMutation({
    mutationFn: async (staffRelationId: string) => {
      console.log("Starting work session for staff:", staffRelationId);
      
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
        console.error("Error starting work session:", error);
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
      
      // Create a properly typed WorkSession
      const session: WorkSession = {
        ...data,
        date: new Date(data.start_time).toISOString().split('T')[0],
        status: data.status as 'active' | 'completed' | 'cancelled'
      };
      
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffWithSessions'] });
    }
  });

  // Add a mutation to end a work session
  const endWorkSession = useMutation({
    mutationFn: async ({ sessionId, earnings, notes }: { sessionId: string, earnings?: number, notes?: string }) => {
      console.log("Ending work session:", { sessionId, earnings, notes });
      
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
        console.error("Error ending work session:", error);
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
      
      // Create a properly typed WorkSession
      const session: WorkSession = {
        ...data,
        date: new Date(data.start_time).toISOString().split('T')[0],
        status: data.status as 'active' | 'completed' | 'cancelled'
      };
      
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffWithSessions'] });
    }
  });

  return {
    startWorkSession,
    endWorkSession
  };
};
