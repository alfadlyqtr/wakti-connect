
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStaffRelationId, getActiveWorkSession } from '@/utils/staffUtils';
import { toast } from "@/components/ui/use-toast";
import { forceSyncStaffContacts } from '@/services/contacts/contactSync';

export const useStaffStatus = () => {
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [activeWorkSession, setActiveWorkSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  // Function to check staff status
  const checkStaffStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is staff from localStorage first for quick response
      const cachedIsStaff = localStorage.getItem('isStaff');
      if (cachedIsStaff === 'true') {
        setIsStaff(true);
      }
      
      // Check if user is staff from localStorage first for quick response
      const cachedStaffRelationId = localStorage.getItem('staffRelationId');
      if (cachedStaffRelationId) {
        setStaffRelationId(cachedStaffRelationId);
        
        // Get active work session
        if (cachedStaffRelationId) {
          const session = await getActiveWorkSession(cachedStaffRelationId);
          setActiveWorkSession(session);
        }
        
        setIsLoading(false);
        return;
      }
      
      // Fallback to checking from database
      const relationId = await getStaffRelationId();
      setStaffRelationId(relationId);
      setIsStaff(!!relationId);
      
      if (relationId) {
        // Get active work session
        const session = await getActiveWorkSession(relationId);
        setActiveWorkSession(session);
        
        // Ensure staff contacts are synced
        await forceSyncStaffContacts();
      }
      
    } catch (err: any) {
      console.error("Error checking staff status:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to start work session
  const startWorkSession = async () => {
    if (!staffRelationId) {
      toast({
        title: "Error",
        description: "Staff ID not found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsStartingSession(true);
      
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
        throw error;
      }
      
      setActiveWorkSession(data);
      
      toast({
        title: "Work Day Started",
        description: "Your work day has been started successfully"
      });
    } catch (error: any) {
      console.error("Error starting work day:", error);
      toast({
        title: "Failed to Start Work Day",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsStartingSession(false);
    }
  };
  
  // Function to end work session
  const endWorkSession = async () => {
    if (!activeWorkSession) {
      toast({
        title: "Error",
        description: "No active work session found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsEndingSession(true);
      
      const { error } = await supabase
        .from('staff_work_logs')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', activeWorkSession.id);
        
      if (error) {
        throw error;
      }
      
      setActiveWorkSession(null);
      
      toast({
        title: "Work Day Ended",
        description: "Your work day has been ended successfully"
      });
    } catch (error: any) {
      console.error("Error ending work day:", error);
      toast({
        title: "Failed to End Work Day",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsEndingSession(false);
    }
  };

  // Run the check on component mount
  useEffect(() => {
    checkStaffStatus();
  }, []);
  
  // Function to manually fetch active work session
  const fetchActiveWorkSession = async (relationId: string) => {
    try {
      const session = await getActiveWorkSession(relationId);
      setActiveWorkSession(session);
    } catch (error) {
      console.error("Error fetching active work session:", error);
    }
  };

  return { 
    isStaff, 
    staffRelationId, 
    activeWorkSession,
    isLoading, 
    error,
    startWorkSession,
    endWorkSession,
    isStartingSession,
    isEndingSession,
    fetchActiveWorkSession,
    refreshStatus: checkStaffStatus
  };
};
