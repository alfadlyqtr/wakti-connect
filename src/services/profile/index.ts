
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/roles';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
  account_type: UserRole;
  created_at: string;
  updated_at: string;
}

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("No authenticated user found");
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
    
    // Map the data to match UserProfile interface with correct role conversion
    const accountType: UserRole = 
      data.account_type === 'business' ? 'business' :
      data.account_type === 'staff' ? 'staff' :
      data.account_type === 'superadmin' || data.account_type === 'super-admin' ? 'superadmin' :
      'individual';
    
    const profile: UserProfile = {
      id: data.id,
      user_id: user.id,
      full_name: data.full_name || null,
      display_name: data.display_name || null,
      avatar_url: data.avatar_url || null,
      account_type: accountType,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return profile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
};

export const getUserRole = async (): Promise<UserRole> => {
  try {
    const profile = await getUserProfile();
    return profile?.account_type || 'individual';
  } catch (error) {
    console.error("Error getting user role:", error);
    return 'individual';
  }
};

export const canUserCreateEvents = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'individual' || role === 'business';
};
