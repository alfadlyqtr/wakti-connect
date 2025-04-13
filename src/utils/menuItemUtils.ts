
import { UserRole } from '@/types/user';

/**
 * Check if a menu item should be hidden based on user role
 */
export const shouldHideMenuItem = (itemPath: string, userRole: UserRole): boolean => {
  // Hide AI-related menu items for staff users
  if (itemPath.includes('/ai') && userRole === 'staff') {
    return true;
  }
  
  return false;
};
