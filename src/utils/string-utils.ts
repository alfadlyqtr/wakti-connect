
/**
 * Generates a URL-friendly slug from a given string
 * @param text The text to convert into a slug
 * @returns A lowercase slug with hyphens replacing spaces and special characters removed
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

/**
 * Truncates a string to a specified length and adds an ellipsis if needed
 * @param text The text to truncate
 * @param length The maximum length
 * @returns Truncated text with ellipsis if longer than specified length
 */
export const truncateText = (text: string, length: number): string => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Capitalizes the first letter of each word in a string
 * @param text The text to capitalize
 * @returns Text with first letter of each word capitalized
 */
export const capitalizeWords = (text: string): string => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
