
import { supabase } from "@/integrations/supabase/client";
import { AppointmentInvitation } from "@/types/appointment.types";
import { toast } from "@/components/ui/use-toast";

/**
 * Invites users to an appointment
 */
export async function sendInvitations(appointmentId: string, invitees: { userId?: string, email?: string }[]): Promise<void> {
  if (!invitees || invitees.length === 0) return;
  
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("You must be logged in to send invitations");
  
  const invitationData = invitees.map(invitee => ({
    appointment_id: appointmentId,
    invited_user_id: invitee.userId || null,
    email: invitee.email || null,
    status: 'pending',
    created_by: session.session.user.id
  }));
  
  const { error } = await supabase
    .from('appointment_invitations')
    .insert(invitationData);
    
  if (error) {
    console.error("Error sending invitations:", error);
    throw new Error(`Failed to send invitations: ${error.message}`);
  }
}

/**
 * Fetches invitations for the current user
 */
export async function fetchMyInvitations(): Promise<AppointmentInvitation[]> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("You must be logged in to view invitations");
  
  const { data, error } = await supabase
    .from('appointment_invitations')
    .select(`
      *,
      appointments:appointment_id(
        id, title, description, start_time, end_time, status
      ),
      profiles:created_by(name, email, avatar_url)
    `)
    .eq('invited_user_id', session.session.user.id)
    .eq('status', 'pending');
    
  if (error) {
    console.error("Error fetching invitations:", error);
    throw new Error(`Failed to fetch invitations: ${error.message}`);
  }
  
  // Cast the data to the correct type with shared_as_link property
  return (data || []).map(invitation => ({
    ...invitation,
    shared_as_link: false, // Default value
  })) as AppointmentInvitation[];
}

/**
 * Updates the status of an invitation
 */
export async function updateInvitationStatus(
  invitationId: string, 
  status: 'accepted' | 'declined'
): Promise<void> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("You must be logged in to respond to invitations");
  
  const { error } = await supabase
    .from('appointment_invitations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', invitationId)
    .eq('invited_user_id', session.session.user.id);
    
  if (error) {
    console.error("Error updating invitation status:", error);
    throw new Error(`Failed to update invitation: ${error.message}`);
  }
  
  // Additional notification could be sent here
}

/**
 * Creates a shareable invitation link
 */
export async function createShareableInvitation(
  appointmentId: string,
  customization?: any
): Promise<string> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("You must be logged in to create shareable invitations");
  
  // First check if the user is allowed to create shareable invitations (paid accounts only)
  const { data: accountType, error: accountTypeError } = await supabase
    .rpc('get_auth_user_account_type', { user_uid: session.session.user.id });
  
  if (accountTypeError) {
    console.error("Error checking account type:", accountTypeError);
    throw new Error(`Unable to verify permissions: ${accountTypeError.message}`);
  }
  
  if (accountType === 'free') {
    throw new Error("Creating shareable invitations is available only for paid accounts");
  }
  
  // Create the invitation
  const { data, error } = await supabase
    .from('appointment_invitations')
    .insert({
      appointment_id: appointmentId,
      shared_as_link: true,
      status: 'pending',
      customization: customization || {},
      created_by: session.session.user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error("Error creating shareable invitation:", error);
    throw new Error(`Failed to create shareable invitation: ${error.message}`);
  }
  
  // Generate a URL for the invitation
  const invitationUrl = `${window.location.origin}/invitation/${data.id}`;
  return invitationUrl;
}

/**
 * Deletes an invitation
 */
export async function deleteInvitation(invitationId: string): Promise<void> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("You must be logged in to delete invitations");
  
  const { error } = await supabase
    .from('appointment_invitations')
    .delete()
    .eq('id', invitationId)
    .or(`created_by.eq.${session.session.user.id},invited_user_id.eq.${session.session.user.id}`);
    
  if (error) {
    console.error("Error deleting invitation:", error);
    throw new Error(`Failed to delete invitation: ${error.message}`);
  }
}

/**
 * Fetches a specific invitation by ID
 */
export async function getInvitationById(invitationId: string): Promise<AppointmentInvitation | null> {
  const { data, error } = await supabase
    .from('appointment_invitations')
    .select(`
      *,
      appointments:appointment_id(*),
      creator:created_by(name, email, avatar_url)
    `)
    .eq('id', invitationId)
    .single();
    
  if (error) {
    console.error("Error fetching invitation:", error);
    return null;
  }
  
  return data as unknown as AppointmentInvitation;
}
