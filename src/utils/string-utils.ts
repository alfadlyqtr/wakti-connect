
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

/**
 * Generates an enhanced slug that includes user information and a title
 * This creates more readable and user-specific slugs
 */
export const generateEnhancedSlug = (userId: string, displayName: string | null, title: string): string => {
  // Create a base from display name or first part of userId if no display name
  const nameBase = displayName 
    ? generateSlug(displayName).substring(0, 15) 
    : userId.substring(0, 8);
  
  // Create a slug from the title
  const titleSlug = generateSlug(title).substring(0, 30);
  
  // Combine them with a unique timestamp to ensure uniqueness
  const timestamp = new Date().getTime().toString().substring(6, 10);
  
  return `${nameBase}-${titleSlug}-${timestamp}`;
};
