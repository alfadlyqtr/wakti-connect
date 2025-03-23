
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { isUserStaff, getStaffRelationId, getActiveWorkSession } from '@/utils/staffUtils';

export const useStaffStatus = () => {
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check staff status
  useEffect(() => {
    const checkStaffStatus = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is staff
        const staffStatus = await isUserStaff();
        setIsStaff(staffStatus);
        
        if (staffStatus) {
          // Get staff relation ID
          const relationId = await getStaffRelationId();
          setStaffRelationId(relationId);
        }
      } catch (error) {
        console.error("Error checking staff status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStaffStatus();
  }, []);
  
  // Get active work session if staff
  const { data: activeWorkSession, isLoading: isSessionLoading } = useQuery({
    queryKey: ['activeWorkSession', staffRelationId],
    queryFn: async () => {
      if (!staffRelationId) return null;
      return getActiveWorkSession(staffRelationId);
    },
    enabled: !!staffRelationId && isStaff
  });
  
  return {
    isStaff,
    staffRelationId,
    isLoading: isLoading || isSessionLoading,
    activeWorkSession
  };
};
