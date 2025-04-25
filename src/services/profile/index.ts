
import { supabase } from '@/integrations/supabase/client';
import { UserRole, mapDatabaseRoleToUserRole } from '@/types/roles';

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

/**
 * Fetches the user profile from Supabase
 * Maps database account_type to UserRole
 * @returns Promise with the user profile or null
 */
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
    
    // Map the database account_type to our UserRole type
    const accountType: UserRole = mapDatabaseRoleToUserRole(data.account_type);
    
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

/**
 * Gets the current user's role
 * @returns Promise with the user role or 'individual' as default
 */
export const getUserRole = async (): Promise<UserRole> => {
  try {
    const profile = await getUserProfile();
    return profile?.account_type || 'individual';
  } catch (error) {
    console.error("Error getting user role:", error);
    return 'individual';
  }
};

/**
 * Checks if the current user can create events
 * Currently, individual and business users can create events
 * @returns Promise<boolean> indicating if user can create events
 */
export const canUserCreateEvents = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'individual' || role === 'business';
};
