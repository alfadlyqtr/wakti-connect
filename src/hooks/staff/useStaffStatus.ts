
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useStaffStatus = () => {
  const [isClocked, setIsClocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkActiveSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsLoading(false);
          return;
        }
        
        // Mock session status
        setIsClocked(false);
        setActiveSessionId(null);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking work session:', error);
        setIsLoading(false);
      }
    };
    
    checkActiveSession();
  }, []);
  
  const clockIn = async () => {
    setIsLoading(true);
    try {
      // Mock clock in
      setIsClocked(true);
      setActiveSessionId('mock-session-id');
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Error clocking in:', error);
      setIsLoading(false);
      return { success: false, error };
    }
  };
  
  const clockOut = async () => {
    setIsLoading(true);
    try {
      // Mock clock out
      setIsClocked(false);
      setActiveSessionId(null);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Error clocking out:', error);
      setIsLoading(false);
      return { success: false, error };
    }
  };
  
  return {
    isClocked,
    isLoading,
    activeSessionId,
    clockIn,
    clockOut
  };
};
