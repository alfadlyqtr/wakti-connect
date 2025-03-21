
import { functionPermissionMap } from './permissionMaps';
import { getStaffRelation } from './staffQueries';

/**
 * Check if the current user can access a specific function
 * 
 * @param functionName The function to check access for
 * @returns Promise<boolean>
 */
export const canAccess = async (functionName: string): Promise<boolean> => {
  try {
    const staffData = await getStaffRelation();
    
    if (!staffData) return false;
    
    const permissions = staffData.permissions || {};
    
    // Check if user has the permission
    const permissionKey = functionPermissionMap[functionName];
    if (!permissionKey) return false;
    
    return !!permissions[permissionKey];
  } catch (error) {
    console.error("Error checking staff access:", error);
    return false;
  }
};
