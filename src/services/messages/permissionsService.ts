
import { supabase } from "@/integrations/supabase/client";
import { getStaffBusinessId } from "@/utils/staffUtils";

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
    
    // Check if the current user is a staff member
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'staff') {
      console.log("User is a staff member");
      
      // Get the business ID for which the user is a staff member
      const businessId = await getStaffBusinessId();
      console.log("Staff member's business ID:", businessId);
      
      if (!businessId) {
        console.log("No business ID found for staff member");
        return false;
      }
      
      // Staff can ALWAYS message their business owner
      if (userId === businessId) {
        console.log("Staff is messaging their business owner, always allowed");
        return true;
      }
      
      // Check if target user is also a staff member of the same business
      const { data: targetStaffData } = await supabase
        .from('business_staff')
        .select('id')
        .eq('staff_id', userId)
        .eq('business_id', businessId)
        .eq('status', 'active')
        .maybeSingle();
        
      if (targetStaffData) {
        console.log("Staff is messaging another staff member of the same business, allowed");
        return true;
      }
      
      console.log("Staff cannot message users outside their business context");
      return false;
    }
    
    // For individual users, check contacts relationship
    if (profile.account_type === 'individual') {
      // Check if users are contacts
      const { data: contactData } = await supabase
        .from('user_contacts')
        .select('id')
        .or(`and(user_id.eq.${session.user.id},contact_id.eq.${userId},status.eq.accepted),and(user_id.eq.${userId},contact_id.eq.${session.user.id},status.eq.accepted)`)
        .maybeSingle();
        
      if (contactData) {
        console.log("Contact relationship found, can message");
        return true;
      }
      
      // Individual users messaging business: check subscription
      const { data: targetProfileData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', userId)
        .maybeSingle();
        
      if (targetProfileData?.account_type === 'business') {
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
    }
    
    console.log("No permission to message user");
    return false;
  } catch (error) {
    console.error("Error checking messaging permissions:", error);
    return false;
  }
};
