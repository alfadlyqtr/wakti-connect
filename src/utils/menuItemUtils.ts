
import { UserRole } from '@/types/user';

/**
 * Check if a menu item should be hidden based on user role
 */
export const shouldHideMenuItem = (itemPath: string, userRole: UserRole): boolean => {
  // Specific path restrictions for staff users
  if (userRole === 'staff') {
    // Staff users cannot access these routes
    const staffRestrictedPaths = [
      '/dashboard/ai',
      '/dashboard/services',
      '/dashboard/business-page',
      '/dashboard/staff',
      '/dashboard/analytics',
      '/dashboard/reports',
      '/dashboard/ai/assistant',
      '/dashboard/events',
    ];
    
    // Check if any of the restricted paths is part of the item path
    return staffRestrictedPaths.some(path => itemPath.includes(path));
  }
  
  // Business-specific routes that non-business users shouldn't see
  if (userRole !== 'business' && userRole !== 'super-admin') {
    const businessOnlyPaths = [
      '/dashboard/services',
      '/dashboard/business-page',
      '/dashboard/staff',
      '/dashboard/analytics',
      '/dashboard/reports',
    ];
    
    return businessOnlyPaths.some(path => itemPath.includes(path));
  }
  
  return false;
};
