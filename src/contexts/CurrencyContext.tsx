
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

  useEffect(() => {
    const loadUserCurrencyPreference = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('currency_preference')
            .eq('id', session.user.id)
            .single();
            
          if (data?.currency_preference && !error) {
            setCurrency(data.currency_preference as Currency);
          }
        }
      } catch (error) {
        console.error('Error loading currency preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCurrencyPreference();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};
