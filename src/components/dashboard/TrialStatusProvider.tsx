
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrialContextType {
  trialEndsAt: Date | null;
  isInTrial: boolean;
  currentPlan: "individual" | "business" | null;
  isLoading: boolean;
}

const TrialContext = createContext<TrialContextType>({
  trialEndsAt: null,
  isInTrial: false,
  currentPlan: null,
  isLoading: true
});

export const useTrialStatus = () => useContext(TrialContext);

export const TrialStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);
  const [isInTrial, setIsInTrial] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<"individual" | "business" | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrialStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsLoading(false);
          return;
        }
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_type, trial_ends_at')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          // Set the current plan
          setCurrentPlan(profile.account_type as "individual" | "business");
          
          // Check if trial_ends_at exists and is in the future
          if (profile.trial_ends_at) {
            const trialEnd = new Date(profile.trial_ends_at);
            setTrialEndsAt(trialEnd);
            setIsInTrial(trialEnd > new Date());
          } else {
            setIsInTrial(false);
          }
        }
      } catch (error) {
        console.error('Error fetching trial status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrialStatus();
  }, []);

  return (
    <TrialContext.Provider value={{ trialEndsAt, isInTrial, currentPlan, isLoading }}>
      {children}
    </TrialContext.Provider>
  );
};
