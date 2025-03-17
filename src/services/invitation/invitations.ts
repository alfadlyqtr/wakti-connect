import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AppointmentInvitation } from "@/types/appointment.types";

/**
 * Get all invitations for the current user
 */
export const getUserInvitations = async (): Promise<AppointmentInvitation[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    const { data, error } = await supabase
      .from('appointment_invitations')
      .select(`
        *,
        appointments:appointment_id (
          id,
          title,
          description,
          location,
          start_time,
          end_time,
          is_all_day,
          status
        ),
        profiles:invited_by (
          id,
          display_name,
          full_name,
          avatar_url
        )
      `)
      .eq('invited_user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching user invitations:", error);
      throw error;
    }
    
    return data as AppointmentInvitation[];
  } catch (error: any) {
    console.error("Error in getUserInvitations:", error);
    throw error;
  }
};

/**
 * Send an invitation to a user for an appointment
 */
export const sendAppointmentInvitation = async (
  appointmentId: string,
  invitedUserId: string
): Promise<AppointmentInvitation> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    // Check if user can send invitations
    const { canSendInvitations } = await getUserRoleForInvitationCapability();
    
    if (!canSendInvitations) {
      toast({
        title: "Premium Feature",
        description: "Sending invitations is only available for paid accounts. Please upgrade your plan.",
        variant: "destructive",
      });
      throw new Error("This feature is only available for paid accounts");
    }
    
    // Check if invitation already exists
    const { data: existingInvitation, error: checkError } = await supabase
      .from('appointment_invitations')
      .select('id')
      .eq('appointment_id', appointmentId)
      .eq('invited_user_id', invitedUserId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing invitation:", checkError);
      throw checkError;
    }
    
    if (existingInvitation) {
      toast({
        title: "Invitation Already Sent",
        description: "This user has already been invited to this appointment.",
        variant: "default",
      });
      throw new Error("Invitation already exists");
    }
    
    // Create the invitation
    const { data, error } = await supabase
      .from('appointment_invitations')
      .insert({
        appointment_id: appointmentId,
        invited_user_id: invitedUserId,
        invited_by: session.user.id,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error sending invitation:", error);
      throw error;
    }
    
    return data as AppointmentInvitation;
  } catch (error: any) {
    console.error("Error in sendAppointmentInvitation:", error);
    
    // Only show toast if not already handled
    if (error.message !== "This feature is only available for paid accounts" &&
        error.message !== "Invitation already exists") {
      toast({
        title: "Failed to Send Invitation",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    throw error;
  }
};

/**
 * Update an invitation status (accept/decline)
 */
export const updateInvitationStatus = async (
  invitationId: string,
  status: 'accepted' | 'declined'
): Promise<AppointmentInvitation> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    const { data, error } = await supabase
      .from('appointment_invitations')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', invitationId)
      .eq('invited_user_id', session.user.id) // Security check
      .select()
      .single();
    
    if (error) {
      console.error("Error updating invitation status:", error);
      throw error;
    }
    
    return data as AppointmentInvitation;
  } catch (error: any) {
    console.error("Error in updateInvitationStatus:", error);
    toast({
      title: "Failed to Update Invitation",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Delete an invitation
 */
export const deleteInvitation = async (invitationId: string): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    const { error } = await supabase
      .from('appointment_invitations')
      .delete()
      .eq('id', invitationId)
      .or(`invited_user_id.eq.${session.user.id},invited_by.eq.${session.user.id}`); // Can be deleted by sender or recipient
    
    if (error) {
      console.error("Error deleting invitation:", error);
      throw error;
    }
  } catch (error: any) {
    console.error("Error in deleteInvitation:", error);
    toast({
      title: "Failed to Delete Invitation",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Check if the current user can send invitations based on their account type
 */
export const getUserRoleForInvitationCapability = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return { canSendInvitations: false, role: 'free' };
    }
    
    const { data: accountType, error } = await supabase
      .rpc('get_auth_user_account_type', { user_uid: session.user.id });
    
    if (error) {
      console.error("Error checking user account type:", error);
      return { canSendInvitations: false, role: 'free' };
    }
    
    return {
      canSendInvitations: accountType !== 'free',
      role: accountType
    };
  } catch (error) {
    console.error("Error in getUserRoleForInvitationCapability:", error);
    return { canSendInvitations: false, role: 'free' };
  }
};

/**
 * Send an invitation via email
 */
export const sendEmailInvitation = async (
  appointmentId: string,
  email: string,
  customMessage?: string
): Promise<AppointmentInvitation> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    // Check if user can send invitations
    const { canSendInvitations } = await getUserRoleForInvitationCapability();
    
    if (!canSendInvitations) {
      toast({
        title: "Premium Feature",
        description: "Sending email invitations is only available for paid accounts. Please upgrade your plan.",
        variant: "destructive",
      });
      throw new Error("This feature is only available for paid accounts");
    }
    
    // Check if invitation already exists
    const { data: existingInvitation, error: checkError } = await supabase
      .from('appointment_invitations')
      .select('id')
      .eq('appointment_id', appointmentId)
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing invitation:", checkError);
      throw checkError;
    }
    
    if (existingInvitation) {
      toast({
        title: "Invitation Already Sent",
        description: "An invitation has already been sent to this email address.",
        variant: "default",
      });
      throw new Error("Invitation already exists");
    }
    
    // Create the invitation
    const { data, error } = await supabase
      .from('appointment_invitations')
      .insert({
        appointment_id: appointmentId,
        email: email,
        invited_by: session.user.id,
        status: 'pending',
        customization: customMessage ? { message: customMessage } : null
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error sending email invitation:", error);
      throw error;
    }
    
    // Trigger email sending via edge function or server action
    // This would typically call a serverless function to send the actual email
    
    return data as AppointmentInvitation;
  } catch (error: any) {
    console.error("Error in sendEmailInvitation:", error);
    
    // Only show toast if not already handled
    if (error.message !== "This feature is only available for paid accounts" &&
        error.message !== "Invitation already exists") {
      toast({
        title: "Failed to Send Email Invitation",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    throw error;
  }
};

/**
 * Create a shareable link invitation
 */
export const createShareableInvitation = async (
  appointmentId: string
): Promise<{ invitationId: string; shareableLink: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    // Check if user can create shareable links
    const { canSendInvitations, role } = await getUserRoleForInvitationCapability();
    
    if (!canSendInvitations) {
      toast({
        title: "Premium Feature",
        description: "Creating shareable links is only available for paid accounts. Please upgrade your plan.",
        variant: "destructive",
      });
      throw new Error("This feature is only available for paid accounts");
    }
    
    // Business accounts can have multiple shareable links, individual accounts can only have one
    if (role !== 'business') {
      // Check if a shareable link already exists
      const { data: existingLink, error: checkError } = await supabase
        .from('appointment_invitations')
        .select('id')
        .eq('appointment_id', appointmentId)
        .eq('shared_as_link', true)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking existing shareable link:", checkError);
        throw checkError;
      }
      
      if (existingLink) {
        toast({
          title: "Link Already Exists",
          description: "A shareable link for this appointment already exists. Please use the existing link.",
          variant: "default",
        });
        throw new Error("Shareable link already exists");
      }
    }
    
    // Create the shareable link invitation
    const { data, error } = await supabase
      .from('appointment_invitations')
      .insert({
        appointment_id: appointmentId,
        invited_by: session.user.id,
        status: 'pending',
        shared_as_link: true
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating shareable link:", error);
      throw error;
    }
    
    // Generate the shareable link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.example.com';
    const shareableLink = `${baseUrl}/invitations/join/${data.id}`;
    
    return {
      invitationId: data.id,
      shareableLink
    };
  } catch (error: any) {
    console.error("Error in createShareableInvitation:", error);
    
    // Only show toast if not already handled
    if (error.message !== "This feature is only available for paid accounts" &&
        error.message !== "Shareable link already exists") {
      toast({
        title: "Failed to Create Shareable Link",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    throw error;
  }
};
