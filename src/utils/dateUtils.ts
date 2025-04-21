
/**
 * Format a date/time string to display time in a readable format
 */
export const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    console.error("Error formatting time:", e);
    return "Invalid date";
  }
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString();
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid date";
  }
};

/**
 * Format a date/time string to a readable format with both date and time
 */
export const formatDateTime = (isoString: string): string => {
  try {
    if (!isoString) return "No date";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid date";
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch (e) {
    console.error("Error formatting datetime:", e, "for string:", isoString);
    return "Invalid date";
  }
};
