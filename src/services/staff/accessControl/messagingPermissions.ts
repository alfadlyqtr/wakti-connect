
import { getStaffRelation, isBusinessOwner, isStaffOfSameBusiness } from './staffQueries';

/**
 * Check if a staff member can message another user
 * 
 * @param targetUserId The ID of the user to message
 * @returns Promise<boolean>
 */
export const canStaffMessageUser = async (targetUserId: string): Promise<boolean> => {
  try {
    const staffData = await getStaffRelation();
    
    if (!staffData) return false;
    
    // Check if target user is the business owner
    const isOwner = await isBusinessOwner(targetUserId);
    if (isOwner) {
      // Staff can always message the business owner
      return true;
    }
    
    // Check if target user is another staff member of the same business
    const isColleague = await isStaffOfSameBusiness(targetUserId, staffData.business_id);
    if (isColleague) {
      // Check if staff has permission to message other staff
      const permissions = staffData.permissions || {};
      // Make sure permissions is an object and has the property
      if (typeof permissions === 'object' && permissions !== null && 'can_message_staff' in permissions) {
        return !!permissions.can_message_staff;
      }
      // Default to true for staff-to-staff messaging if permission not explicitly set
      return true;
    }
    
    // Not a business owner or staff member - deny
    return false;
  } catch (error) {
    console.error("Error checking staff messaging permissions:", error);
    return false;
  }
};
