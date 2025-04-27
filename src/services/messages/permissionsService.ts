
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
      console.log("No active session found");
      return false;
    }

    // Check if users are connected in the user_contacts table with status 'accepted'
    const { data: contactData, error: contactError } = await supabase
      .from('user_contacts')
      .select('id, status')
      .or(`and(user_id.eq.${session.user.id},contact_id.eq.${recipientId}),and(user_id.eq.${recipientId},contact_id.eq.${session.user.id})`)
      .eq('status', 'accepted')
      .maybeSingle();

    if (contactError) {
      console.error("Error checking contact status:", contactError);
      return false;
    }
    
    // If they are contacts with accepted status, they can message
    if (contactData) {
      return true;
    }

    // Fall back to checking business relationships
    const { data: businessProfile } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .maybeSingle();

    // Business owners can always message their staff
    if (businessProfile?.account_type === 'business') {
      const { data: staffData } = await supabase
        .from('business_staff')
        .select('id')
        .eq('business_id', session.user.id)
        .eq('staff_id', recipientId)
        .eq('status', 'active')
        .maybeSingle();

      if (staffData) {
        return true;
      }
    }
    
    // Staff can message their business owner
    const { data: staffData } = await supabase
      .from('business_staff')
      .select('business_id')
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (staffData && staffData.business_id === recipientId) {
      return true;
    }

    // Not connected and no business relationship
    return false;
  } catch (error) {
    console.error("Error checking messaging permissions:", error);
    return false;
  }
};
