
import { supabase } from '@/integrations/supabase/client';

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getDashboardUserProfile = async () => {
  try {
    // Get current authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw authError;
    
    if (!authData.user) {
      return null;
    }
    
    const userId = authData.user.id;
    
    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError && profileError.code !== 'PGRST116') throw profileError;
    
    // Check if user is staff
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('*')
      .eq('staff_id', userId)
      .maybeSingle();
      
    // Check if user is super admin
    const { data: adminData, error: adminError } = await supabase
      .from('super_admins')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    return {
      userId,
      profileData,
      isStaff: !!staffData,
      userRole: staffData?.role || profileData?.account_type || 'free',
      isSuperAdmin: !!adminData,
    };
  } catch (error) {
    console.error('Error fetching dashboard user profile:', error);
    return {
      profileData: null,
      userId: null,
      isStaff: false,
      userRole: 'free',
      isSuperAdmin: false,
    };
  }
};
