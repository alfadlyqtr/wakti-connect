
import { supabase } from '@/lib/supabase';

// Updated UserProfile interface to match the database structure
export interface UserProfile {
  id: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
  account_type: 'free' | 'individual' | 'business';
  created_at: string;
  updated_at: string;
  business_name?: string;
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
    
    // Using explicit type selection to ensure proper typing
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, display_name, avatar_url, account_type, created_at, updated_at, business_name')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
    
    if (!data) return null;
    
    // Manually cast the account_type to ensure it matches our expected types
    const accountType = data.account_type as 'free' | 'individual' | 'business';

    // Return the profile with properly typed fields
    return {
      id: data.id,
      full_name: data.full_name,
      display_name: data.display_name,
      avatar_url: data.avatar_url,
      account_type: accountType,
      created_at: data.created_at,
      updated_at: data.updated_at,
      business_name: data.business_name
    };
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
