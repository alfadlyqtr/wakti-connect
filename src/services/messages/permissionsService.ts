
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
      
      // Staff can always message their business owner
      if (userId === staffBusinessId) {
        console.log("Staff is messaging their business owner, allowed");
        return true;
      }
      
      // Check if target user is also a staff member of the same business
      const { data: targetStaffData } = await supabase
        .from('business_staff')
        .select('id')
        .eq('staff_id', userId)
        .eq('business_id', staffBusinessId)
        .maybeSingle();
        
      if (targetStaffData) {
        // Check if user has permission to message staff
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
          
          if (permissionsObj.can_message_staff) {
            console.log("Staff is messaging another staff member, allowed");
            return true;
          }
        }
        
        console.log("Staff does not have permission to message other staff");
        return false;
      }
      
      // Staff should not be able to message customers unless they have explicit permission
      const { data: staffPermissions } = await supabase
        .from('business_staff')
        .select('permissions')
        .eq('staff_id', session.user.id)
        .eq('business_id', staffBusinessId)
        .single();
      
      if (staffPermissions?.permissions && 
          typeof staffPermissions.permissions === 'object' && 
          staffPermissions.permissions !== null) {
        // Cast to Record to safely access properties
        const permissionsObj = staffPermissions.permissions as Record<string, boolean>;
        
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
      
      // Staff should not be able to add contacts or message other users
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
