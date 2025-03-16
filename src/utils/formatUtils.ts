
/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a number as a percentage
 */
export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "—";
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Format a number with commas
 */
export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat('en-US').format(value);
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
