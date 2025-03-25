
import { format, formatDistanceStrict } from 'date-fns';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Create a context to store and provide the user's currency preference
export const CurrencyContext = createContext<string>('USD');

// Custom hook to use the currency context
export const useCurrency = () => useContext(CurrencyContext);

// Format currency with locale and currency code
export const formatCurrency = (amount: number | null | undefined, currencyCode?: string): string => {
  if (amount === null || amount === undefined) {
    return '-';
  }
  
  // If no currencyCode is provided, use the one from context
  const contextCurrency = useCurrency();
  const currency = currencyCode || contextCurrency || 'USD';
  
  // Currency formatting options for each supported currency
  const currencyFormatOptions: Record<string, Intl.NumberFormatOptions> = {
    USD: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
    QAR: { style: 'currency', currency: 'QAR', minimumFractionDigits: 2 },
    AED: { style: 'currency', currency: 'AED', minimumFractionDigits: 2 },
    SAR: { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 },
    KWD: { style: 'currency', currency: 'KWD', minimumFractionDigits: 3 }, // KWD uses 3 decimal places
    BHD: { style: 'currency', currency: 'BHD', minimumFractionDigits: 3 }, // BHD uses 3 decimal places
    OMR: { style: 'currency', currency: 'OMR', minimumFractionDigits: 3 }, // OMR uses 3 decimal places
  };
  
  // Use the options for the specified currency, or fall back to USD
  const options = currencyFormatOptions[currency] || currencyFormatOptions.USD;
  
  return new Intl.NumberFormat('en-US', options).format(amount);
};

// Format duration between two dates
export const formatDuration = (start: Date, end: Date): string => {
  try {
    return formatDistanceStrict(end, start);
  } catch (error) {
    console.error('Error formatting duration:', error);
    return 'N/A';
  }
};

// Format date to display format
export const formatDate = (date: string | Date): string => {
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Format time to display format
export const formatTime = (date: string | Date): string => {
  try {
    return format(new Date(date), 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
};

// Format datetime to display format
export const formatDateTime = (date: string | Date): string => {
  try {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'Invalid date/time';
  }
};

// Provider component for currency context
export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
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
