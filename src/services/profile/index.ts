
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
  account_type: 'free' | 'individual' | 'business';
  created_at: string;
  updated_at: string;
}

/**
 * Fetches the current user's profile
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
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
};

/**
 * Gets the current user's role ('free', 'individual', or 'business')
 */
export const getUserRole = async (): Promise<'free' | 'individual' | 'business'> => {
  try {
    const profile = await getUserProfile();
    return profile?.account_type || 'free';
  } catch (error) {
    console.error("Error getting user role:", error);
    return 'free';
  }
};

/**
 * Checks if the current user has permission to create events
 */
export const canUserCreateEvents = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'individual' || role === 'business';
};
