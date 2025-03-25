
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CurrencyContext } from './formatUtils';

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<string>('USD');

  useEffect(() => {
    const fetchUserCurrency = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          return;
        }
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('currency_preference')
          .eq('id', session.session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching currency preference:', error);
          return;
        }
        
        if (profile?.currency_preference) {
          console.log('Setting currency to:', profile.currency_preference);
          setCurrency(profile.currency_preference);
        }
      } catch (error) {
        console.error('Error in fetchUserCurrency:', error);
      }
    };

    fetchUserCurrency();
  }, []);

  return (
    <CurrencyContext.Provider value={currency}>
      {children}
    </CurrencyContext.Provider>
  );
};
