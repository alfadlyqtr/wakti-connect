
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import i18next from "i18next";

/**
 * Formats a date into a readable string format
 */
export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = i18next.language === 'ar' ? ar : undefined;
  
  return format(dateObj, 'MMM d, HH:mm', { locale });
};

/**
 * Convert a date and time strings to ISO format
 */
export const formatDateTimeToISO = (date: Date, startTime: string, endTime: string) => {
  const startDateTime = new Date(date);
  const endDateTime = new Date(date);
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  startDateTime.setHours(startHours, startMinutes);
  endDateTime.setHours(endHours, endMinutes);
  
  return {
    start_time: startDateTime.toISOString(),
    end_time: endDateTime.toISOString()
  };
};

/**
 * Format price with correct currency symbol and direction based on language
 */
export const formatPrice = (amount: number, currency: string = "QAR") => {
  const isRtl = i18next.language === 'ar';
  
  if (isRtl) {
    // For Arabic, convert to Arabic numerals and use appropriate symbol
    const arabicAmount = amount.toString().replace(/[0-9]/g, (digit) => 
      String.fromCharCode(digit.charCodeAt(0) + 1584)
    );
    
    return currency === "QAR" 
      ? `${arabicAmount} ر.ق` 
      : `$${arabicAmount}`;
  }
  
  // For English
  return currency === "QAR" 
    ? `QAR ${amount.toFixed(2)}` 
    : `$${amount.toFixed(2)}`;
};

/**
 * Format currency with appropriate formatting
 */
export const formatCurrency = (amount: number, currency: string = "QAR") => {
  return formatPrice(amount, currency);
};
