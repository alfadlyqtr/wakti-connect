
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStaffRelationId } from "@/utils/staffUtils";
import { useToast } from "@/components/ui/use-toast";

export const useStaffRelationFetcher = () => {
  const { toast } = useToast();
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [activeWorkSession, setActiveWorkSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch active work session
  const fetchActiveWorkSession = async (relationId: string) => {
    try {
      console.log("Fetching active work session for staff relation:", relationId);
      
      const { data: activeSessions, error: sessionsError } = await supabase
        .from('staff_work_logs')
        .select('*')
        .eq('staff_relation_id', relationId)
        .is('end_time', null)
        .eq('status', 'active')
        .maybeSingle();
        
      if (sessionsError) {
        console.error("Error fetching active work session:", sessionsError);
        setError(`Could not fetch active work session: ${sessionsError.message}`);
        return;
      }
      
      console.log("Active work session:", activeSessions);
      setActiveWorkSession(activeSessions);
    } catch (error: any) {
      console.error("Error fetching active work session:", error);
      setError(`Could not fetch active work session: ${error.message}`);
    }
  };

  // Fetch staff relation ID
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First get authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No authenticated user found");
          setIsLoading(false);
          setError("No authenticated user found");
          return;
        }
        
        console.log("Authenticated user ID:", user.id);
        
        // First try to get staff relation ID from utility function with caching
        const relationId = await getStaffRelationId();
        
        if (relationId) {
          console.log("Found staff relation ID from cache:", relationId);
          setStaffRelationId(relationId);
          await fetchActiveWorkSession(relationId);
          setIsLoading(false);
          return;
        }
        
        // If that fails, try direct database query
        console.log("No cached relation ID, fetching from database for user:", user.id);
        
        const { data, error } = await supabase
          .from('business_staff')
          .select('id, permissions')
          .eq('staff_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching staff relation:", error);
          if (error.code === 'PGRST116') {
            setError("No staff relationship found. You might not be registered as staff.");
          } else {
            setError(`Could not fetch your staff relationship: ${error.message}`);
          }
          setIsLoading(false);
          return;
        }
        
        console.log("Found staff relation:", data);
        setStaffRelationId(data.id);
        
        // Also cache this for future use
        localStorage.setItem('staffRelationId', data.id);
        if (data.permissions) {
          localStorage.setItem('staffPermissions', JSON.stringify(data.permissions));
        }
        
        // Also check for active work session
        await fetchActiveWorkSession(data.id);
        
      } catch (error: any) {
        console.error("Error fetching staff relation:", error);
        setError(`Could not fetch your staff relationship: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStaffData();
  }, [toast]);

  return {
    staffRelationId,
    activeWorkSession,
    isLoading,
    error,
    fetchActiveWorkSession
  };
};
