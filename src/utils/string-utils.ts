
/**
 * Generates a slug from a string by converting to lowercase,
 * removing special characters, and replacing spaces with hyphens
 */
export const generateSlug = (text: string): string => {
  if (!text) return "";
  
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};
