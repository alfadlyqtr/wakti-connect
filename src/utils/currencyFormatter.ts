
import { supabase } from '@/integrations/supabase/client';

// Cache for the user's currency preference
let userCurrencyCache: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get the user's currency preference from the cache or fetch it
export const getUserCurrency = async (): Promise<string> => {
  // Check if we have a valid cached value
  const now = Date.now();
  if (userCurrencyCache && (now - cacheTimestamp < CACHE_DURATION)) {
    return userCurrencyCache;
  }
  
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      return 'USD'; // Default if not authenticated
    }
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('currency_preference')
      .eq('id', session.session.user.id)
      .single();
      
    if (error) {
      console.error('Error fetching currency preference:', error);
      return 'USD';
    }
    
    // Update the cache
    userCurrencyCache = profile?.currency_preference || 'USD';
    cacheTimestamp = now;
    
    return userCurrencyCache;
  } catch (error) {
    console.error('Error in getUserCurrency:', error);
    return 'USD';
  }
};

// Format currency without using React hooks
export const formatCurrencyNonReactive = async (amount: number | null | undefined): Promise<string> => {
  if (amount === null || amount === undefined) {
    return '-';
  }
  
  const currency = await getUserCurrency();
  
  // Currency formatting options for each supported currency
  const currencyFormatOptions: Record<string, Intl.NumberFormatOptions> = {
    USD: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
    QAR: { style: 'currency', currency: 'QAR', minimumFractionDigits: 2 },
    AED: { style: 'currency', currency: 'AED', minimumFractionDigits: 2 },
    SAR: { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 },
    KWD: { style: 'currency', currency: 'KWD', minimumFractionDigits: 3 },
    BHD: { style: 'currency', currency: 'BHD', minimumFractionDigits: 3 },
    OMR: { style: 'currency', currency: 'OMR', minimumFractionDigits: 3 },
  };
  
  const options = currencyFormatOptions[currency] || currencyFormatOptions.USD;
  
  return new Intl.NumberFormat('en-US', options).format(amount);
};
