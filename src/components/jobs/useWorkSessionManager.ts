
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWorkSessionManager = (
  staffRelationId: string | null,
  activeWorkSession: any | null,
  onSessionUpdate: () => void
) => {
  const { toast } = useToast();
  
  // Start work day
  const startWorkDay = async () => {
    if (!staffRelationId) {
      toast({
        title: "Error",
        description: "Staff relationship not found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log("Starting work day for staff relation:", staffRelationId);
      
      const { data, error } = await supabase
        .from('staff_work_logs')
        .insert({
          staff_relation_id: staffRelationId,
          start_time: new Date().toISOString(),
          status: 'active'
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error starting work day:", error);
        toast({
          title: "Error",
          description: `Could not start your work day: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Work day started:", data);
      
      // Call the callback to refresh the session data
      onSessionUpdate();
      
      toast({
        title: "Work day started",
        description: "Your work day has been started successfully",
      });
    } catch (error: any) {
      console.error("Error starting work day:", error);
      toast({
        title: "Error",
        description: `Could not start your work day: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  // End work day
  const endWorkDay = async () => {
    if (!activeWorkSession) return;
    
    try {
      console.log("Ending work day for session:", activeWorkSession.id);
      
      const { data, error } = await supabase
        .from('staff_work_logs')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', activeWorkSession.id)
        .select()
        .single();
        
      if (error) {
        console.error("Error ending work day:", error);
        toast({
          title: "Error",
          description: `Could not end your work day: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Work day ended:", data);
      
      // Call the callback to refresh the session data
      onSessionUpdate();
      
      toast({
        title: "Work day ended",
        description: "Your work day has been ended successfully",
      });
    } catch (error: any) {
      console.error("Error ending work day:", error);
      toast({
        title: "Error",
        description: `Could not end your work day: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  return {
    startWorkDay,
    endWorkDay
  };
};
