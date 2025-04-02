
import { supabase } from '@/lib/supabase';
import { InvitationCustomization } from '@/types/invitation.types';
import { formatErrorMessage } from '@/lib/utils';

/**
 * Get customization settings for an invitation
 */
export const getInvitationCustomization = async (invitationId: string): Promise<InvitationCustomization | null> => {
  try {
    const sessionResponse = await supabase.auth.getSession();
    if (!sessionResponse.data.session) {
      throw new Error('You must be logged in to view invitation customization');
    }
    
    // Instead of using a direct table that might not exist, let's modify our approach
    // Let's check for customization details in the events table
    const { data, error } = await supabase
      .from('events')
      .select('customization')
      .eq('id', invitationId)
      .single();
    
    if (error) {
      console.error('Error fetching invitation customization:', error);
      return null;
    }
    
    if (!data?.customization) {
      // Create default customization
      return {
        background: {
          type: 'color',
          value: '#ffffff'
        },
        font: {
          family: 'system-ui, sans-serif',
          size: 'medium',
          color: '#333333',
          alignment: 'left'
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
        },
        headerStyle: 'simple',
        headerImage: '',
        mapLocation: '',
        animation: 'fade'
      };
    }
    
    // Return the customization from the event
    return data.customization as InvitationCustomization;
  } catch (error) {
    console.error('Error in getInvitationCustomization:', error);
    return null;
  }
};

/**
 * Update customization settings for an invitation
 */
export const updateInvitationCustomization = async (
  invitationId: string,
  customization: Partial<InvitationCustomization>
): Promise<{ success: boolean; message: string }> => {
  try {
    // Instead of using a table that might not exist, let's update the customization in the events table
    const { error } = await supabase
      .from('events')
      .update({ customization })
      .eq('id', invitationId);
    
    if (error) {
      console.error('Error updating invitation customization:', error);
      return {
        success: false,
        message: formatErrorMessage(error)
      };
    }
    
    return {
      success: true,
      message: 'Invitation customization updated successfully'
    };
  } catch (error) {
    console.error('Error in updateInvitationCustomization:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Convert database customization format to application format
 */
export const formatInvitationCustomization = (data: any): InvitationCustomization => {
  // Default customization if no data is provided
  if (!data) {
    return {
      background: {
        type: 'color',
        value: '#ffffff'
      },
      font: {
        family: 'system-ui, sans-serif',
        size: 'medium',
        color: '#333333',
        alignment: 'left'
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
      },
      headerStyle: 'simple',
      animation: 'fade'
    };
  }
  
  // Format existing data
  return {
    background: {
      type: data.background?.type || 'color',
      value: data.background?.value || '#ffffff'
    },
    font: {
      family: data.font?.family || 'system-ui, sans-serif',
      size: data.font?.size || 'medium',
      color: data.font?.color || '#333333',
      alignment: data.font?.alignment || 'left'
    },
    buttons: {
      accept: {
        background: data.buttons?.accept?.background || '#4CAF50',
        color: data.buttons?.accept?.color || '#ffffff',
        shape: data.buttons?.accept?.shape || 'rounded'
      },
      decline: {
        background: data.buttons?.decline?.background || '#f44336',
        color: data.buttons?.decline?.color || '#ffffff',
        shape: data.buttons?.decline?.shape || 'rounded'
      }
    },
    headerStyle: data.headerStyle || 'simple',
    headerImage: data.headerImage || '',
    mapLocation: data.mapLocation || '',
    animation: data.animation || 'fade'
  };
};
