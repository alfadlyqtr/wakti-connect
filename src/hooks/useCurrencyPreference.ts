
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCurrencyPreference = () => {
  const [currency, setCurrency] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('currency_preference')
          .eq('id', session.session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching currency preference:', error);
          setError(new Error(error.message));
          setIsLoading(false);
          return;
        }
        
        if (data?.currency_preference) {
          setCurrency(data.currency_preference);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch currency preference');
        console.error('Error in useCurrencyPreference:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurrency();
  }, []);
  
  return { currency, isLoading, error };
};
