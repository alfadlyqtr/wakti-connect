
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Currency } from '@/contexts/CurrencyContext';

/**
 * Hook to get a business's currency preference
 */
export const useBusinessCurrency = (businessId?: string) => {
  const globalCurrency = useCurrency();
  const [businessCurrency, setBusinessCurrency] = useState<Currency | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!businessId) {
      console.log('No business ID provided to useBusinessCurrency');
      return;
    }
    
    console.log('Fetching currency for business ID:', businessId);
    
    const fetchBusinessCurrency = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('currency_preference')
          .eq('id', businessId)
          .single();
          
        if (error) {
          console.error('Error fetching business currency:', error);
          throw error;
        }
        
        if (data?.currency_preference) {
          console.log('Business currency found:', data.currency_preference);
          setBusinessCurrency(data.currency_preference as Currency);
        } else {
          console.log('No currency preference set for business');
        }
      } catch (error) {
        console.error('Error fetching business currency:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinessCurrency();
  }, [businessId]);
  
  return {
    currency: businessCurrency || globalCurrency.currency,
    isLoading: isLoading || globalCurrency.isLoading
  };
};
