
import { supabase } from "@/integrations/supabase/client";
import { 
  InvitationRequest, 
  InvitationResponse, 
  InvitationTarget,
  InvitationCustomization
} from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";

/**
 * Creates a new invitation for an appointment
 */
export const sendInvitation = async (
  appointmentId: string,
  invitationData: InvitationRequest
): Promise<InvitationResponse> => {
  try {
    // Create the invitation in the database
    const { data, error } = await supabase
      .from('appointment_invitations')
      .insert({
        appointment_id: appointmentId,
        invited_user_id: invitationData.target.type === 'user' ? invitationData.target.id : null,
        email: invitationData.target.type === 'email' ? invitationData.target.id : null,
        status: 'pending',
        shared_as_link: invitationData.shared_as_link || false,
        customization: invitationData.customization || null
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating invitation:", error);
      throw new Error(`Failed to create invitation: ${error.message}`);
    }

    return {
      id: data.id,
      status: 'sent',
      created_at: data.created_at
    };
  } catch (error: any) {
    console.error("Error sending invitation:", error);
    throw error;
  }
};

/**
 * Updates an invitation's status (accept/decline)
 */
export const respondToInvitation = async (
  invitationId: string,
  response: 'accepted' | 'declined'
): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase
      .from('appointment_invitations')
      .update({ status: response })
      .eq('id', invitationId);

    if (error) {
      console.error("Error responding to invitation:", error);
      throw new Error(`Failed to respond to invitation: ${error.message}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error responding to invitation:", error);
    throw error;
  }
};

/**
 * Deletes an invitation
 */
export const deleteInvitation = async (
  invitationId: string
): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase
      .from('appointment_invitations')
      .delete()
      .eq('id', invitationId);

    if (error) {
      console.error("Error deleting invitation:", error);
      throw new Error(`Failed to delete invitation: ${error.message}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting invitation:", error);
    throw error;
  }
};

/**
 * Get all invitations for the current user
 */
export const getUserInvitations = async () => {
  try {
    // Get the user's account type to check permissions
    const { data: userRole, error: roleError } = await supabase.rpc(
      "get_auth_user_account_type"
    );

    if (roleError) {
      throw new Error(`Failed to check user role: ${roleError.message}`);
    }

    // Only fetch if user has a paid account
    if (userRole === "free") {
      toast({
        title: "Premium Feature",
        description: "Invitations are only available for paid accounts",
        variant: "destructive",
      });
      return [];
    }

    // Get invitations where the current user is invited
    const { data, error } = await supabase
      .from('appointment_invitations')
      .select(`
        *,
        appointments:appointment_id (*)
      `)
      .eq('status', 'pending');

    if (error) {
      console.error("Error fetching invitations:", error);
      throw new Error(`Failed to fetch invitations: ${error.message}`);
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching invitations:", error);
    throw error;
  }
};
