
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/helper";
import { canStaffMessageUser } from "../staff/accessControl";
import { isUserStaff } from "@/utils/staffUtils";

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
    
    // Check if current user is staff
    const isStaff = await isUserStaff();
    if (isStaff) {
      const canMessage = await canStaffMessageUser(userId);
      console.log("Staff user can message:", canMessage);
      return canMessage;
    }
    
    // Get the current user's profile
    const { data: profile } = await fromTable('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
      
    if (!profile) {
      console.log("Current user profile not found");
      return false;
    }
    
    // Free users cannot message anyone
    if (profile.account_type === 'free') {
      console.log("Free users cannot message anyone");
      return false;
    }
    
    // Business users can message anyone
    if (profile.account_type === 'business') {
      console.log("Business users can message anyone");
      return true;
    }
    
    // First check contacts - this is the most common case
    const { data: contactData } = await fromTable('user_contacts')
      .select('id')
      .or(`and(user_id.eq.${session.user.id},contact_id.eq.${userId},status.eq.accepted),and(user_id.eq.${userId},contact_id.eq.${session.user.id},status.eq.accepted)`)
      .maybeSingle();
      
    if (contactData) {
      console.log("Contact relationship found, can message");
      return true;
    }
    
    // Get the target user's profile
    const { data: targetProfile } = await fromTable('profiles')
      .select('account_type')
      .eq('id', userId)
      .maybeSingle();
      
    if (!targetProfile) {
      console.log("Target user profile not found");
      return false;
    }
    
    // Individual users messaging business: check subscription
    if (targetProfile.account_type === 'business') {
      const { data: subscriptionData } = await fromTable('business_subscribers')
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
