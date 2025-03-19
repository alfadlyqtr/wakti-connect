
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility to verify access control settings are working correctly
 */
export const accessControlVerifier = {
  /**
   * Test if the user's roles are properly set in access_control_manager
   */
  async verifyRoles(): Promise<{success: boolean; message: string}> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, message: "No active session" };
      }

      // 1. Check profile account_type
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) {
        return { 
          success: false, 
          message: `Failed to fetch profile: ${profileError.message}` 
        };
      }
      
      // 2. Check access_control_manager entry
      const { data: accessControl, error: accessControlError } = await supabase
        .from('access_control_manager')
        .select('role, business_id, role_level')
        .eq('user_id', session.user.id)
        .order('role_level', { ascending: false })
        .limit(1);
        
      if (accessControlError) {
        return { 
          success: false, 
          message: `Failed to fetch access control: ${accessControlError.message}` 
        };
      }
      
      if (!accessControl || accessControl.length === 0) {
        return {
          success: false,
          message: "No access control entry found. Run populate_access_control() function."
        };
      }
      
      // 3. Check get_user_role function
      const { data: userRole, error: userRoleError } = await supabase.rpc('get_user_role');
      
      if (userRoleError) {
        return {
          success: false,
          message: `Failed to get user role: ${userRoleError.message}`
        };
      }
      
      // 4. Verify it all matches
      const accountType = profile.account_type;
      const acRole = accessControl[0].role;
      
      if (accountType === 'business' && acRole !== 'business_owner') {
        return {
          success: false,
          message: `Mismatch: account_type=${accountType} but role=${acRole}`
        };
      }
      
      return {
        success: true,
        message: `Access control verified: profile=${accountType}, role=${acRole}, get_user_role=${userRole}`
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error verifying access control: ${error.message}`
      };
    }
  },
  
  /**
   * Test if user has the expected staff permissions
   */
  async verifyStaffPermissions(): Promise<{success: boolean; message: string}> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, message: "No active session" };
      }
      
      // Check if user is staff
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('id, business_id, role, service_permission, booking_permission, staff_permission, analytics_permission')
        .eq('staff_id', session.user.id)
        .limit(1);
        
      if (staffError) {
        return { 
          success: false, 
          message: `Failed to fetch staff: ${staffError.message}` 
        };
      }
      
      if (!staffData || staffData.length === 0) {
        return {
          success: true,
          message: "User is not a staff member, no permissions to verify"
        };
      }
      
      const staff = staffData[0];
      
      // Check if permissions match role
      if (staff.role === 'co-admin' && staff.staff_permission !== 'admin') {
        return {
          success: false,
          message: `Co-admin should have admin staff permissions, but has ${staff.staff_permission}`
        };
      }
      
      // Test permission checking function
      const { data: hasPermission, error: permissionError } = await supabase.rpc(
        'has_business_permission',
        { 
          business_uuid: staff.business_id,
          permission_type: 'service',
          required_level: staff.service_permission
        }
      );
      
      if (permissionError) {
        return {
          success: false,
          message: `Permission check failed: ${permissionError.message}`
        };
      }
      
      if (!hasPermission) {
        return {
          success: false,
          message: `Permission check returned false when it should be true`
        };
      }
      
      return {
        success: true,
        message: `Staff permissions verified. Role: ${staff.role}, Service: ${staff.service_permission}, Booking: ${staff.booking_permission}`
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error verifying staff permissions: ${error.message}`
      };
    }
  }
};
