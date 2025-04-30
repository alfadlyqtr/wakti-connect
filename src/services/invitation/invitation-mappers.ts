
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType } from '@/types/invitation.types';
import { InvitationDbRecord, SimpleInvitationResult } from './invitation-types';

/**
 * Create customization object from database record
 */
export function createCustomizationObject(data: InvitationDbRecord): SimpleInvitationCustomization {
  return {
    background: {
      type: data.background_type as BackgroundType,
      value: data.background_value || '#ffffff',
    },
    font: {
      family: data.font_family || 'system-ui, sans-serif',
      size: data.font_size || 'medium',
      color: data.text_color || '#000000',
      alignment: data.text_align || 'left',
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
  
  // Create customization object explicitly using the helper function
  const customization = createCustomizationObject(data);
  
  // Create intermediate result object first
  const result: SimpleInvitationResult = {
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
    customization: customization,
  };
  
  // Cast the result to SimpleInvitation type to break the deep type instantiation
  return result as SimpleInvitation;
}
