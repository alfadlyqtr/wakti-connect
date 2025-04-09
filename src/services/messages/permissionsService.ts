
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the current user can message another user
 * 
 * @param targetUserId The ID of the user to check if messaging is allowed
 * @returns Promise with boolean indicating if messaging is allowed
 */
export const canMessageUser = async (targetUserId: string): Promise<boolean> => {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return false; // Not logged in
    }
    
    // Don't allow messaging self
    if (session.user.id === targetUserId) {
      return false;
    }
    
    // Check if users are contacts
    const { data: contactData } = await supabase
      .from('user_contacts')
      .select('status')
      .or(`and(user_id.eq.${session.user.id},contact_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},contact_id.eq.${session.user.id})`)
      .eq('status', 'accepted')
      .maybeSingle();
      
    // If they are contacts, messaging is allowed
    if (contactData) {
      return true;
    }
    
    // Get current user profile
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
      
    // Business and individual accounts can message without being contacts
    if (currentUserProfile?.account_type === 'business' || 
        currentUserProfile?.account_type === 'individual') {
      return true;
    }
    
    // Free accounts need to be contacts first
    return false;
    
  } catch (error) {
    console.error("Error checking messaging permissions:", error);
    return false;
  }
};
