
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Currency = 'USD' | 'QAR' | 'AED' | 'SAR' | 'KWD' | 'BHD' | 'OMR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'QAR', // Changed default from USD to QAR
  setCurrency: () => {},
  isLoading: false
});

export const useCurrency = () => useContext(CurrencyContext);

interface CurrencyProviderProps {
  children: React.ReactNode;
  initialCurrency?: string;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ 
  children, 
  initialCurrency
}) => {
  const [currency, setCurrency] = useState<Currency>('QAR'); // Changed default from USD to QAR
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUserCurrency = async () => {
      console.info('Loading user currency preference');
      setIsLoading(true);
      
      try {
        // If we've been given a business ID (initialCurrency), load that business's currency
        if (initialCurrency) {
          const { data, error } = await supabase
            .from('profiles')
            .select('currency_preference')
            .eq('id', initialCurrency)
            .single();
            
          if (!error && data?.currency_preference) {
            console.info('Specific business currency preference loaded:', data.currency_preference);
            setCurrency(data.currency_preference as Currency);
            setIsLoading(false);
            return;
          }
        }
        
        // Otherwise, load the current user's currency preference
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('currency_preference')
            .eq('id', session.user.id)
            .single();
            
          if (!error && data?.currency_preference) {
            console.info('User currency preference loaded:', data.currency_preference);
            setCurrency(data.currency_preference as Currency);
          } else {
            // If no preference set, default to QAR instead of USD
            setCurrency('QAR');
          }
        } else {
          // Default to QAR for anonymous users
          setCurrency('QAR');
        }
      } catch (error) {
        console.error('Error loading currency preference:', error);
        // Set default to QAR if there's an error
        setCurrency('QAR');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserCurrency();
  }, [initialCurrency]);
  
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};
