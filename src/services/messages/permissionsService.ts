
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the current user can message another user
 * 
 * @param targetUserId The ID of the user to check if messaging is allowed
 * @returns Promise with boolean indicating if messaging is allowed
 */
export const canMessageUser = async (targetUserId: string): Promise<boolean> => {
  try {
    console.log("Checking permissions to message user:", targetUserId);
    
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log("No authenticated user found");
      return false; // Not logged in
    }
    
    // Don't allow messaging self
    if (session.user.id === targetUserId) {
      console.log("Cannot message self");
      return false;
    }
    
    // Check if this is a staff-business relationship
    const isStaff = localStorage.getItem('userRole') === 'staff';
    
    if (isStaff) {
      // Get the business ID for this staff member
      const { data: staffData } = await supabase
        .from('business_staff')
        .select('business_id')
        .eq('staff_id', session.user.id)
        .eq('status', 'active')
        .maybeSingle();
        
      if (staffData?.business_id === targetUserId) {
        console.log("Staff can message their business owner");
        return true;
      }
      
      // Staff can message other staff of the same business
      if (staffData?.business_id) {
        const { data: otherStaffData } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', targetUserId)
          .eq('business_id', staffData.business_id)
          .eq('status', 'active')
          .maybeSingle();
          
        if (otherStaffData) {
          console.log("Staff can message other staff of the same business");
          return true;
        }
      }
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
      console.log("Users are contacts, messaging allowed");
      return true;
    }
    
    // Check if this is a business-staff relationship
    const { data: isBusinessStaff } = await supabase
      .from('business_staff')
      .select('id')
      .eq('business_id', session.user.id)
      .eq('staff_id', targetUserId)
      .eq('status', 'active')
      .maybeSingle();
      
    if (isBusinessStaff) {
      console.log("Business can message its staff");
      return true; // Business can message its staff
    }
    
    const { data: isStaffBusiness } = await supabase
      .from('business_staff')
      .select('id')
      .eq('business_id', targetUserId)
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (isStaffBusiness) {
      console.log("Staff can message their business");
      return true; // Staff can message their business
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
      console.log("Business/Individual account can message anyone");
      return true;
    }
    
    console.log("Free account users can only message contacts");
    // Free accounts need to be contacts first
    return false;
    
  } catch (error) {
    console.error("Error checking messaging permissions:", error);
    return false;
  }
};
