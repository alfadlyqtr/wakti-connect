
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation } from "../types";

/**
 * Fetches all staff invitations for the current business
 */
export const fetchInvitations = async (): Promise<StaffInvitation[]> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session?.session?.user) {
    throw new Error('Not authenticated');
  }
  
  // Get business profile name first
  const { data: businessProfile, error: profileError } = await supabase
    .from('profiles')
    .select('business_name')
    .eq('id', session.session.user.id)
    .single();
    
  if (profileError) {
    console.error("Error fetching business profile:", profileError);
    throw new Error('Could not fetch business profile');
  }
  
  // Then fetch invitations
  const { data, error } = await supabase
    .from('staff_invitations')
    .select('*')
    .eq('business_id', session.session.user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching staff invitations:", error);
    throw error;
  }
  
  // Add business_name to each invitation
  return data.map(invitation => ({
    ...invitation,
    business_name: businessProfile.business_name || 'Your Business'
  })) as StaffInvitation[];
};
