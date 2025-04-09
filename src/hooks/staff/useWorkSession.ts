
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWorkSession = (staffRelationId: string | null) => {
  const { toast } = useToast();
  const [activeWorkSession, setActiveWorkSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state
  
  // Fetch active work session
  useEffect(() => {
    const fetchActiveWorkSession = async () => {
      if (!staffRelationId) {
        setIsLoading(false); // Set loading to false when there's no staffRelationId
        return;
      }
      
      try {
        setIsLoading(true); // Set loading to true before fetch
        console.log("Fetching active work session for staff relation:", staffRelationId);
        
        const { data: activeSessions, error: sessionsError } = await supabase
          .from('staff_work_logs')
          .select('*')
          .eq('staff_relation_id', staffRelationId)
          .is('end_time', null)
          .eq('status', 'active')
          .maybeSingle();
          
        if (sessionsError) {
          console.error("Error fetching active work session:", sessionsError);
          setIsLoading(false); // Set loading to false on error
          return;
        }
        
        console.log("Active work session:", activeSessions);
        setActiveWorkSession(activeSessions);
        setIsLoading(false); // Set loading to false after successful fetch
      } catch (error: any) {
        console.error("Error fetching active work session:", error);
        setIsLoading(false); // Set loading to false on error
      }
    };
    
    if (staffRelationId) {
      fetchActiveWorkSession();
    } else {
      setIsLoading(false); // Ensure loading is false when no staffRelationId
    }
  }, [staffRelationId]);
  
  // Start/End work session
  const startWorkDay = async () => {
    if (!staffRelationId) return;
    
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
          description: `Failed to start work day: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Work day started:", data);
      setActiveWorkSession(data);
      
      toast({
        title: "Work day started",
        description: "You have successfully started your work day.",
      });
    } catch (error: any) {
      console.error("Error starting work day:", error);
      toast({
        title: "Error",
        description: `Failed to start work day: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
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
          description: `Failed to end work day: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Work day ended:", data);
      setActiveWorkSession(null);
      
      toast({
        title: "Work day ended",
        description: "You have successfully ended your work day.",
      });
    } catch (error: any) {
      console.error("Error ending work day:", error);
      toast({
        title: "Error",
        description: `Failed to end work day: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  return {
    activeWorkSession,
    startWorkDay,
    endWorkDay,
    isLoading // Export isLoading state
  };
};
