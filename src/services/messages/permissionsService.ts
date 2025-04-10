
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the current user can message another user
 * 
 * @param recipientId The ID of the message recipient
 * @returns Promise with boolean indicating if the user can message
 */
export const canMessageUser = async (recipientId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return false;
    }

    // Get current user's profile to check account type
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
    
    if (profileError || !profileData) {
      console.error("Error fetching user profile:", profileError);
      return false;
    }
    
    // Free users can't message anyone
    if (profileData.account_type === 'free') {
      console.log("Free users cannot send messages");
      return false;
    }
    
    // Check if users are connected in the contacts table
    const { data: contactData, error: contactError } = await supabase
      .from('contacts')
      .select('id, status')
      .or(`and(user_id.eq.${session.user.id},contact_id.eq.${recipientId}),and(user_id.eq.${recipientId},contact_id.eq.${session.user.id})`)
      .eq('status', 'approved')
      .maybeSingle();
    
    if (contactData) {
      return true;
    }
    
    // Check if the user is a business
    const { data: recipientData } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', recipientId)
      .maybeSingle();
      
    if (recipientData?.account_type === 'business') {
      // Check if user is subscribed to the business
      const { data: subscriptionData } = await supabase
        .from('business_subscribers')
        .select('id')
        .eq('business_id', recipientId)
        .eq('subscriber_id', session.user.id)
        .maybeSingle();
        
      if (subscriptionData) {
        return true;
      }
    }
    
    // By default, if they're not connected, they can't message
    return false;
  } catch (error) {
    console.error("Error checking messaging permissions:", error);
    return false;
  }
};
