
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import i18next from "i18next";

/**
 * Calculate total hours for a work session
 */
export const calculateHours = (startTime: string, endTime: string | null) => {
  if (!endTime) return i18next.language === 'ar' ? "جاري التنفيذ" : "In progress";
  
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const hours = (end - start) / (1000 * 60 * 60);
  
  // Convert to Arabic numerals if language is Arabic
  if (i18next.language === 'ar') {
    return hours.toFixed(2).replace(/[0-9]/g, (digit) => 
      String.fromCharCode(digit.charCodeAt(0) + 1584)
    );
  }
  
  return hours.toFixed(2);
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const locale = i18next.language === 'ar' ? ar : undefined;
  
  return format(date, 'EEE, MMM d', { locale });
};

/**
 * Format time to readable format
 */
export const formatTime = (timeString: string | null) => {
  if (!timeString) return "—";
  
  const time = new Date(timeString);
  const locale = i18next.language === 'ar' ? ar : undefined;
  
  return format(time, 'HH:mm', { locale });
};
