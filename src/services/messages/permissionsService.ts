
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
    const staffBusinessId = await getStaffBusinessId();
    if (staffBusinessId) {
      console.log("User is staff member of business:", staffBusinessId);
      
      // Check if target user is business owner (staff can message their business)
      if (userId === staffBusinessId) {
        console.log("Staff is messaging their business owner, allowed");
        return true;
      }
      
      // Check if user has permission to message staff (other staff in same business)
      const { data: staffPermissions } = await supabase
        .from('business_staff')
        .select('permissions')
        .eq('staff_id', session.user.id)
        .eq('business_id', staffBusinessId)
        .single();
      
      // Safely handle permissions by ensuring it's an object and has the property
      if (staffPermissions?.permissions && 
          typeof staffPermissions.permissions === 'object' && 
          staffPermissions.permissions !== null) {
        // Cast to Record to safely access properties
        const permissionsObj = staffPermissions.permissions as Record<string, boolean>;
        
        // Check if staff can message other staff
        if (permissionsObj.can_message_staff) {
          // Check if target is another staff member of the same business
          const { data: targetStaffData } = await supabase
            .from('business_staff')
            .select('id')
            .eq('staff_id', userId)
            .eq('business_id', staffBusinessId)
            .maybeSingle();
            
          if (targetStaffData) {
            console.log("Staff is messaging another staff member, allowed");
            return true;
          }
        }
        
        // Check if user has permission to message customers
        if (permissionsObj.can_message_customers) {
          // Check if target is a customer of the business
          const { data: isCustomer } = await supabase
            .from('business_subscribers')
            .select('id')
            .eq('subscriber_id', userId)
            .eq('business_id', staffBusinessId)
            .maybeSingle();
            
          if (isCustomer) {
            console.log("Staff is messaging a customer, allowed");
            return true;
          }
        }
      }
    }
    
    // First check contacts - this is the most common case for non-staff or permissions not covered above
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
