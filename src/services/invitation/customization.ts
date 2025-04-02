
import { supabase } from '@/integrations/supabase/client';

// Get an invitation customization by ID
export const getInvitationCustomization = async (invitationId: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to access customizations');
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('customization')
      .eq('id', invitationId)
      .single();
    
    if (error) {
      console.error('Error fetching invitation customization:', error);
      throw new Error(error.message);
    }
    
    return data?.customization || getDefaultCustomization();
  } catch (error) {
    console.error('Error in getInvitationCustomization:', error);
    return getDefaultCustomization();
  }
};

// Create a default customization for a new invitation
export const getDefaultCustomization = () => {
  return {
    background: {
      type: 'solid',
      value: '#ffffff'
    },
    font: {
      family: 'Inter, sans-serif',
      size: 'medium',
      color: '#333333'
    },
    buttons: {
      accept: {
        background: '#4CAF50',
        color: '#ffffff',
        shape: 'rounded'
      },
      decline: {
        background: '#f44336',
        color: '#ffffff',
        shape: 'rounded'
      }
    }
  };
};

// Save an invitation customization
export const saveInvitationCustomization = async (eventId: string, customization: any) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to save customizations');
    }
    
    const { data, error } = await supabase
      .from('events')
      .update({ customization })
      .eq('id', eventId)
      .eq('user_id', session.session.user.id)
      .single();
    
    if (error) {
      console.error('Error saving invitation customization:', error);
      throw new Error(error.message);
    }
    
    return data?.customization;
  } catch (error) {
    console.error('Error in saveInvitationCustomization:', error);
    throw error;
  }
};

// Get customization from an invitation
export const getCustomizationFromInvitation = async (invitationId: string) => {
  try {
    const { data, error } = await supabase
      .from('event_invitations')
      .select(`
        event_id,
        events:event_id (
          customization
        )
      `)
      .eq('id', invitationId)
      .single();
    
    if (error) {
      console.error('Error fetching customization from invitation:', error);
      throw new Error(error.message);
    }
    
    if (!data || !data.events || !data.events.customization) {
      return getDefaultCustomization();
    }
    
    return data.events.customization;
  } catch (error) {
    console.error('Error in getCustomizationFromInvitation:', error);
    return getDefaultCustomization();
  }
};

// Helper function to create a new invitation with customization
export const createInvitationCustomization = () => {
  return getDefaultCustomization();
};
