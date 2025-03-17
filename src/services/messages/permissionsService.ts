
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/helper";

/**
 * Checks if the current user can message a given user
 */
export const canMessageUser = async (userId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return false;
    }
    
    // Get the current user's profile
    const { data: profile } = await fromTable('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
      
    if (!profile) return false;
    
    // Free users cannot message anyone
    if (profile.account_type === 'free') {
      return false;
    }
    
    // Business users can message anyone
    if (profile.account_type === 'business') {
      return true;
    }
    
    // Get the target user's profile
    const { data: targetProfile } = await fromTable('profiles')
      .select('account_type')
      .eq('id', userId)
      .maybeSingle();
      
    if (!targetProfile) return false;
    
    // Individual users messaging individual users: check contacts
    if (targetProfile.account_type === 'individual') {
      const { data: contactData } = await fromTable('user_contacts')
        .select('id')
        .or(`and(user_id.eq.${session.user.id},contact_id.eq.${userId},status.eq.accepted),and(user_id.eq.${userId},contact_id.eq.${session.user.id},status.eq.accepted)`)
        .maybeSingle();
        
      return !!contactData;
    }
    
    // Individual users messaging business: check subscription
    if (targetProfile.account_type === 'business') {
      const { data: subscriptionData } = await fromTable('business_subscribers')
        .select('id')
        .eq('subscriber_id', session.user.id)
        .eq('business_id', userId)
        .maybeSingle();
        
      return !!subscriptionData;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking messaging permissions:", error);
    return false;
  }
};
