
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { isUserStaff, getStaffRelationId, getActiveWorkSession } from '@/utils/staffUtils';
import { isBusinessOwner } from '@/utils/jobsUtils';

export const useStaffStatus = () => {
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [isBusiness, setIsBusiness] = useState<boolean>(false);
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Check staff and business status
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Starting staff status check");
        
        // Check if user is authenticated first
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          console.log("No authenticated session found");
          setIsLoading(false);
          return;
        }
        
        // Check if user is staff
        const staffStatus = await isUserStaff();
        console.log("Staff status check result:", staffStatus);
        setIsStaff(staffStatus);
        
        // Check if user is business owner
        const businessStatus = await isBusinessOwner();
        console.log("Business owner status check result:", businessStatus);
        setIsBusiness(businessStatus);
        
        if (staffStatus || businessStatus) {
          // Get staff relation ID
          const relationId = await getStaffRelationId();
          console.log("Staff relation ID from useStaffStatus:", relationId);
          setStaffRelationId(relationId);
        }
      } catch (err) {
        console.error("Error checking user status:", err);
        setError(err instanceof Error ? err : new Error('Failed to check user status'));
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserStatus();
  }, []);
  
  // Get active work session if staff
  const { data: activeWorkSession, isLoading: isSessionLoading, refetch: refetchSession, error: sessionError } = useQuery({
    queryKey: ['activeWorkSession', staffRelationId],
    queryFn: async () => {
      if (!staffRelationId) return null;
      console.log("Fetching active work session for staff relation:", staffRelationId);
      try {
        const session = await getActiveWorkSession(staffRelationId);
        console.log("Active work session:", session);
        return session;
      } catch (error) {
        console.error("Error in activeWorkSession query:", error);
        return null;
      }
    },
    enabled: !!staffRelationId && (isStaff || isBusiness),
    refetchInterval: 60000 // Refetch every minute to keep the session updated
  });
  
  // Functions to start and end work sessions
  const startWorkSession = async () => {
    try {
      if (!staffRelationId) {
        throw new Error("No staff relation ID available");
      }
      
      const { data, error } = await supabase
        .from('staff_work_logs')
        .insert([{
          staff_relation_id: staffRelationId,
          start_time: new Date().toISOString(),
          status: 'active'
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      refetchSession();
      return data;
    } catch (err) {
      console.error("Error starting work session:", err);
      setError(err instanceof Error ? err : new Error('Failed to start work session'));
      throw err;
    }
  };
  
  const endWorkSession = async () => {
    try {
      if (!activeWorkSession?.id) {
        throw new Error("No active work session to end");
      }
      
      const { data, error } = await supabase
        .from('staff_work_logs')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', activeWorkSession.id)
        .select()
        .single();
        
      if (error) throw error;
      
      refetchSession();
      return data;
    } catch (err) {
      console.error("Error ending work session:", err);
      setError(err instanceof Error ? err : new Error('Failed to end work session'));
      throw err;
    }
  };
  
  return {
    isStaff,
    isBusiness,
    staffRelationId,
    isLoading: isLoading || isSessionLoading,
    error: error || sessionError,
    activeWorkSession,
    refetchSession,
    startWorkSession,
    endWorkSession,
    isStartingSession: false,
    isEndingSession: false
  };
};
