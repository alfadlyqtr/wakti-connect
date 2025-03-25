
import { useCurrency } from '@/contexts/CurrencyContext';

export const useCurrencyFormat = () => {
  const { currency } = useCurrency();
  
  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) {
      return '-';
    }
    
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
  
  return { formatCurrency, currency };
};
