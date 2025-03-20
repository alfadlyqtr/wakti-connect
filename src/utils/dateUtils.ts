
/**
 * Format a date/time string to display time in a readable format
 */
export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString();
};

/**
 * Format a date/time string to a readable format with both date and time
 */
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return `${formatDate(isoString)} ${formatTime(isoString)}`;
};
