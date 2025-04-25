import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/user";

// Correct ID for the super admin - used for direct comparison to avoid RLS issues
const SUPER_ADMIN_ID = "28e863b3-0a91-4220-8330-fbee7ecd3f96";

/**
 * Checks if the user is a super admin directly against the super_admins table
 * @param userId User ID to check
 * @returns Promise<boolean> true if user is a super admin
 */
export const checkSuperAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data: superAdminData } = await supabase
      .from('super_admins')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    const isSuperAdmin = !!superAdminData;
    localStorage.setItem('isSuperAdmin', JSON.stringify(isSuperAdmin));
    return isSuperAdmin;
  } catch (error) {
    console.error("Error checking super admin status:", error);
    return false;
  }
};

/**
 * Fetches the dashboard user profile, determines user roles, and sets local storage
 * @returns Promise with profile data, user ID, roles, and loading state
 */
export async function getDashboardUserProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    console.warn("No active session found");
    return {
      profileData: null,
      userId: null,
      userRole: 'individual' as UserRole,
      isStaff: false,
      isSuperAdmin: false,
    };
  }
  
  const userId = session.user.id;
  
  // Fetch profile data
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }
  
  // Fetch staff relation data
  const { data: staffRelation, error: staffError } = await supabase
    .from('business_staff')
    .select('*')
    .eq('staff_id', userId)
    .maybeSingle();
  
  if (staffError) {
    console.error("Error fetching staff relation:", staffError);
  }
  
  const isStaff = !!staffRelation;
  localStorage.setItem('isStaff', JSON.stringify(isStaff));
  
  // Update role checks to use 'superadmin'
  const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true' || 
    (await checkSuperAdminStatus(userId));
  
  const effectiveRole = isSuperAdmin ? 'superadmin' : 
    (profileData?.account_type as UserRole) || 'individual';
  
  localStorage.setItem('userRole', effectiveRole);
  
  return {
    profileData: profileData || null,
    userId,
    userRole: effectiveRole,
    isStaff,
    isSuperAdmin,
  };
}
