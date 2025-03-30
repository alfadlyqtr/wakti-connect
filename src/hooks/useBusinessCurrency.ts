
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
    if (!businessId) return;
    
    const fetchBusinessCurrency = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching currency for business:', businessId);
        const { data, error } = await supabase
          .from('profiles')
          .select('currency_preference')
          .eq('id', businessId)
          .single();
          
        if (error) {
          console.error('Error fetching business currency:', error);
          throw error;
        }
        
        console.log('Business currency data:', data);
        
        if (data?.currency_preference) {
          console.log('Setting business currency to:', data.currency_preference);
          setBusinessCurrency(data.currency_preference as Currency);
        } else {
          console.log('No currency preference found for business, using default');
        }
      } catch (error) {
        console.error('Error fetching business currency:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinessCurrency();
  }, [businessId]);
  
  console.log('useBusinessCurrency hook returning:', { 
    currency: businessCurrency || globalCurrency.currency,
    isLoading: isLoading || globalCurrency.isLoading
  });
  
  return {
    currency: businessCurrency || globalCurrency.currency,
    isLoading: isLoading || globalCurrency.isLoading
  };
};
