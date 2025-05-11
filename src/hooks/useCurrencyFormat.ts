
import { useState, useEffect } from 'react';

interface CurrencyFormatOptions {
  businessId?: string;
  locale?: string;
  currency?: string;
}

export const useCurrencyFormat = ({ 
  businessId, 
  locale = 'en-US', 
  currency = 'USD' 
}: CurrencyFormatOptions) => {
  const [formatOptions, setFormatOptions] = useState({
    locale,
    currency
  });
  
  useEffect(() => {
    // In a real app, you might fetch currency preferences from the business profile
    // For now, we'll just use the defaults
    if (businessId) {
      console.log(`Using currency format for business: ${businessId}`);
    }
  }, [businessId]);
  
  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '';
    
    return new Intl.NumberFormat(formatOptions.locale, {
      style: 'currency',
      currency: formatOptions.currency
    }).format(amount);
  };
  
  return {
    formatCurrency,
    locale: formatOptions.locale,
    currency: formatOptions.currency
  };
};
