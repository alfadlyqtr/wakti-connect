
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Currency = 'USD' | 'QAR' | 'AED' | 'SAR' | 'KWD' | 'BHD' | 'OMR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  isLoading: true
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isLoading, setIsLoading] = useState(true);

  const updateCurrencyPreference = async (newCurrency: Currency) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Update the state first for immediate UI response
        setCurrency(newCurrency);
        
        // Then update the database
        const { error } = await supabase
          .from('profiles')
          .update({ currency_preference: newCurrency })
          .eq('id', session.user.id);
          
        if (error) {
          console.error('Error updating currency preference:', error);
        } else {
          console.log('Currency preference updated successfully to:', newCurrency);
        }
      }
    } catch (error) {
      console.error('Error updating currency preference:', error);
    }
  };

  useEffect(() => {
    const loadUserCurrencyPreference = async () => {
      setIsLoading(true);
      try {
        console.log("Loading user currency preference");
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('currency_preference')
            .eq('id', session.user.id)
            .single();
            
          if (data?.currency_preference && !error) {
            console.log("User currency preference loaded:", data.currency_preference);
            setCurrency(data.currency_preference as Currency);
          } else {
            console.log("No currency preference found, using default USD");
          }
        }
      } catch (error) {
        console.error('Error loading currency preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCurrencyPreference();
    
    // Set up a subscription to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadUserCurrencyPreference();
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency: updateCurrencyPreference, 
      isLoading 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
