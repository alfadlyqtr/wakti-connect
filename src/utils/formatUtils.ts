
import { format, formatDistanceStrict } from 'date-fns';
import { CURRENCY_SYMBOLS, SupportedCurrency } from '@/hooks/useCurrencySettings';

// Format currency with locale and currency code
export const formatCurrency = (
  amount: number | null | undefined,
  currencyCode: SupportedCurrency = 'USD'
): string => {
  if (amount === null || amount === undefined) {
    return '-';
  }
  
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2
    });
    
    return formatter.format(amount);
  } catch (error) {
    // Fallback if formatting fails
    return `${CURRENCY_SYMBOLS[currencyCode]}${amount.toFixed(2)}`;
  }
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
