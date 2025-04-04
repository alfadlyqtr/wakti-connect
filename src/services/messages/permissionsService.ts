
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the current user can message a given user
 */
export const canMessageUser = async (userId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log("No active session found");
      return false;
    }

    // Always allow users to message themselves (for testing)
    if (userId === session.user.id) {
      console.log("User can message themselves");
      return true;
    }
    
    // Get the current user's profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
      
    if (profileError || !profileData) {
      console.log("Current user profile not found");
      return false;
    }
    
    const profile = profileData as { account_type: string };
    
    // Business users can message anyone
    if (profile.account_type === 'business') {
      console.log("Business users can message anyone");
      return true;
    }
    
    // Free users cannot message anyone
    if (profile.account_type === 'free') {
      console.log("Free users cannot message anyone");
      return false;
    }
    
    // First check contacts - this is the most common case
    const { data: contactData } = await supabase
      .from('user_contacts')
      .select('id')
      .or(`and(user_id.eq.${session.user.id},contact_id.eq.${userId},status.eq.accepted),and(user_id.eq.${userId},contact_id.eq.${session.user.id},status.eq.accepted)`)
      .maybeSingle();
      
    if (contactData) {
      console.log("Contact relationship found, can message");
      return true;
    }
    
    // Get the target user's profile
    const { data: targetProfileData, error: targetProfileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', userId)
      .maybeSingle();
      
    if (targetProfileError || !targetProfileData) {
      console.log("Target user profile not found");
      return false;
    }
    
    const targetProfile = targetProfileData as { account_type: string };
    
    // Individual users messaging business: check subscription
    if (targetProfile.account_type === 'business') {
      const { data: subscriptionData } = await supabase
        .from('business_subscribers')
        .select('id')
        .eq('subscriber_id', session.user.id)
        .eq('business_id', userId)
        .maybeSingle();
      
      const canMessage = !!subscriptionData;
      console.log("Check if subscribed to business:", canMessage);
      return canMessage;
    }
    
    console.log("No permission to message user");
    return false;
  } catch (error) {
    console.error("Error checking messaging permissions:", error);
    return false;
  }
};
