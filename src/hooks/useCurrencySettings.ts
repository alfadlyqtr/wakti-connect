
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type SupportedCurrency = "BHD" | "OMR" | "QAR" | "SAR" | "AED" | "KWD" | "USD";

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  BHD: "BD",
  OMR: "OMR",
  QAR: "QAR",
  SAR: "SAR",
  AED: "AED",
  KWD: "KWD",
  USD: "$"
};

export const CURRENCY_NAMES: Record<SupportedCurrency, string> = {
  BHD: "Bahraini Dinar",
  OMR: "Omani Rial",
  QAR: "Qatari Riyal",
  SAR: "Saudi Arabian Riyal",
  AED: "UAE Dirham",
  KWD: "Kuwaiti Dinar",
  USD: "US Dollar"
};

// Default currency used if not set
export const DEFAULT_CURRENCY: SupportedCurrency = "USD";

export const useCurrencySettings = () => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Query to fetch the user's currency preference
  const { 
    data: currency, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['currencySettings'],
    queryFn: async (): Promise<SupportedCurrency> => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          throw new Error('Not authenticated');
        }
        
        // Fetch profile to get currency setting
        const { data, error } = await supabase
          .from('profiles')
          .select('currency_preference')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error("Error fetching currency preference:", error);
          throw error;
        }
        
        // Return the user's currency preference or the default
        return (data?.currency_preference as SupportedCurrency) || DEFAULT_CURRENCY;
      } catch (error) {
        console.error("Error in currency settings fetch:", error);
        return DEFAULT_CURRENCY;
      }
    },
    staleTime: 60000 * 60, // 1 hour
  });

  // Update currency preference mutation
  const updateCurrencyMutation = useMutation({
    mutationFn: async (newCurrency: SupportedCurrency): Promise<SupportedCurrency> => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          throw new Error('Not authenticated');
        }
        
        // Update the profile with the new currency preference
        const { error } = await supabase
          .from('profiles')
          .update({
            currency_preference: newCurrency,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id);
          
        if (error) {
          console.error("Error updating currency preference:", error);
          throw error;
        }
        
        return newCurrency;
      } catch (error) {
        console.error("Error in updateCurrency mutation:", error);
        throw error;
      }
    },
    onSuccess: (newCurrency) => {
      // Invalidate the currency query to refetch with updated data
      queryClient.invalidateQueries({ queryKey: ['currencySettings'] });
      
      toast({
        title: "Currency updated",
        description: `Your currency has been updated to ${CURRENCY_NAMES[newCurrency]}.`
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (currency && !isInitialized) {
      setIsInitialized(true);
    }
  }, [currency, isInitialized]);

  return {
    currency: currency || DEFAULT_CURRENCY,
    isLoading,
    error,
    updateCurrency: updateCurrencyMutation.mutate,
    isUpdating: updateCurrencyMutation.isPending,
    currencySymbol: currency ? CURRENCY_SYMBOLS[currency] : CURRENCY_SYMBOLS[DEFAULT_CURRENCY],
    allCurrencies: Object.keys(CURRENCY_NAMES) as SupportedCurrency[]
  };
};
