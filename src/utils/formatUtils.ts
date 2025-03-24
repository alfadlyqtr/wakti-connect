
import { format, formatDistanceStrict } from 'date-fns';

// Format currency with locale and currency code
export const formatCurrency = (amount: number | null | undefined, currencyCode: string = 'USD'): string => {
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
  const options = currencyFormatOptions[currencyCode] || currencyFormatOptions.USD;
  
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
