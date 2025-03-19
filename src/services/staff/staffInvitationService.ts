
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface StaffInvitation {
  id: string;
  business_id: string;
  email: string;
  name: string;
  position?: string;
  role: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface CreateStaffInvitationParams {
  email: string;
  name: string;
  position?: string;
  role: string;
}

/**
 * Create a staff invitation and send an invitation email
 */
export const createStaffInvitation = async (params: CreateStaffInvitationParams): Promise<StaffInvitation | null> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      throw new Error("You must be logged in to invite staff members");
    }
    
    const businessId = session.session.user.id;
    const token = uuidv4();
    
    // Create the invitation record in the database
    const { data: invitation, error } = await supabase
      .from('staff_invitations')
      .insert({
        business_id: businessId,
        email: params.email,
        name: params.name,
        position: params.position,
        role: params.role,
        token: token,
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }

    // Get business name for the email
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_name, display_name, full_name')
      .eq('id', businessId)
      .single();
      
    const businessName = profile?.business_name || profile?.display_name || profile?.full_name || "Business";
    
    // Generate invitation URL
    const inviteUrl = `${window.location.origin}/auth/staff-invitation?token=${token}`;
    
    // Send invitation email
    const { error: emailError } = await supabase.functions.invoke('send-staff-invitation', {
      body: {
        invitationId: invitation.id,
        email: params.email,
        name: params.name,
        businessName,
        role: params.role,
        inviteUrl,
      },
    });
    
    if (emailError) {
      console.error("Error sending invitation email:", emailError);
      // Continue even if email fails, we can resend it later
    }
    
    return invitation;
  } catch (error) {
    console.error("Error creating staff invitation:", error);
    throw error;
  }
};

/**
 * Get a staff invitation by token
 */
export const getStaffInvitationByToken = async (token: string): Promise<StaffInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('staff_invitations')
      .select('*')
      .eq('token', token)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error getting staff invitation:", error);
    return null;
  }
};

/**
 * Get all staff invitations for the current business
 */
export const getBusinessStaffInvitations = async (): Promise<StaffInvitation[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      throw new Error("You must be logged in to view staff invitations");
    }
    
    const businessId = session.session.user.id;
    
    const { data, error } = await supabase
      .from('staff_invitations')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error getting business staff invitations:", error);
    return [];
  }
};

/**
 * Update a staff invitation status
 */
export const updateStaffInvitationStatus = async (invitationId: string, status: 'pending' | 'accepted' | 'expired'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('staff_invitations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', invitationId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating staff invitation status:", error);
    return false;
  }
};

/**
 * Delete a staff invitation
 */
export const deleteStaffInvitation = async (invitationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('staff_invitations')
      .delete()
      .eq('id', invitationId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting staff invitation:", error);
    return false;
  }
};

/**
 * Resend an invitation email
 */
export const resendStaffInvitation = async (invitationId: string): Promise<boolean> => {
  try {
    // Get the invitation data
    const { data: invitation, error } = await supabase
      .from('staff_invitations')
      .select('*')
      .eq('id', invitationId)
      .single();
      
    if (error) {
      throw error;
    }
    
    // Get business name for the email
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_name, display_name, full_name')
      .eq('id', invitation.business_id)
      .single();
      
    const businessName = profile?.business_name || profile?.display_name || profile?.full_name || "Business";
    
    // Generate invitation URL
    const inviteUrl = `${window.location.origin}/auth/staff-invitation?token=${invitation.token}`;
    
    // Send invitation email
    const { error: emailError } = await supabase.functions.invoke('send-staff-invitation', {
      body: {
        invitationId: invitation.id,
        email: invitation.email,
        name: invitation.name,
        businessName,
        role: invitation.role,
        inviteUrl,
      },
    });
    
    if (emailError) {
      throw emailError;
    }
    
    // Update the invitation record with new updated_at and expires_at timestamps
    const { error: updateError } = await supabase
      .from('staff_invitations')
      .update({
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', invitationId);
      
    if (updateError) {
      throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error("Error resending staff invitation:", error);
    return false;
  }
};
