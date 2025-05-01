
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType } from '@/types/invitation.types';
import { InvitationDbRecord, SimpleInvitationResult } from './invitation-types';

/**
 * Create customization object from database record
 */
export function createCustomizationObject(data: InvitationDbRecord): SimpleInvitationCustomization {
  // Always provide default values for all properties to avoid type issues
  return {
    background: {
      type: (data.background_type || 'solid') as BackgroundType,
      value: data.background_value || '#ffffff',
    },
    font: {
      family: data.font_family || 'system-ui, sans-serif',
      size: data.font_size || 'medium',
      color: data.text_color || '#000000',
      alignment: data.text_align || 'left', // Always provide a default value
      weight: 'normal', // Default weight if missing
    },
  };
}

/**
 * Maps a database record to the SimpleInvitation application model
 */
export function mapDatabaseToSimpleInvitation(data: InvitationDbRecord): SimpleInvitation {
  // Parse datetime if present
  let date: string | undefined;
  let time: string | undefined;
  
  if (data.datetime) {
    const dateObj = new Date(data.datetime);
    date = dateObj.toISOString().split('T')[0];
    time = dateObj.toTimeString().split(' ')[0].substring(0, 5);
  }
  
  // Create customization object with all required properties
  const customization = createCustomizationObject(data);
  
  // Use a direct approach without intermediate types to avoid deep nesting
  const invitation: SimpleInvitation = {
    id: data.id,
    title: data.title,
    description: data.description || '',
    location: data.location_url || data.location || '',
    locationTitle: data.location_title || '',
    date,
    time,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userId: data.user_id,
    shareId: data.share_id || undefined,
    isPublic: data.is_public || false,
    isEvent: data.is_event || false,
    customization: {
      background: {
        type: customization.background.type,
        value: customization.background.value
      },
      font: {
        family: customization.font.family,
        size: customization.font.size,
        color: customization.font.color,
        alignment: customization.font.alignment || 'left',
        weight: customization.font.weight || 'normal'
      }
    }
  };
  
  return invitation;
}
