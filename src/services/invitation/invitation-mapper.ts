
import { InvitationDbRecord } from './invitation-types';
import { SimpleInvitation, BackgroundType, TextPosition, ButtonPosition, ButtonShape } from '@/types/invitation.types';

/**
 * Maps a database record to a SimpleInvitation object
 */
export function mapDbRecordToSimpleInvitation(record: InvitationDbRecord): SimpleInvitation {
  // Convert datetime string to date and time
  let date: string | undefined;
  let time: string | undefined;
  
  if (record.datetime) {
    const dateObj = new Date(record.datetime);
    date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
    time = dateObj.toISOString().split('T')[1].substring(0, 5); // HH:MM format
  }
  
  // Simple validation to ensure background_type is valid
  const backgroundType = (
    record.background_type === 'solid' || 
    record.background_type === 'gradient' || 
    record.background_type === 'image' || 
    record.background_type === 'ai'
  ) ? record.background_type as BackgroundType : 'solid';
  
  // Create the SimpleInvitation
  return {
    id: record.id,
    title: record.title,
    description: record.description || '',
    location: record.location || '',
    locationTitle: record.location_title || '',
    date,
    time,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    userId: record.user_id,
    shareId: record.share_id,
    isPublic: record.is_public,
    isEvent: record.is_event,
    customization: {
      background: {
        type: backgroundType,
        value: record.background_value || '#ffffff'
      },
      font: {
        family: record.font_family || 'system-ui, sans-serif',
        size: record.font_size || 'medium',
        color: record.text_color || '#000000',
        alignment: record.text_align || 'center'
      },
      buttons: {
        accept: {
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded' as ButtonShape
        },
        decline: {
          background: '#EF4444',
          color: '#ffffff',
          shape: 'rounded' as ButtonShape
        },
        directions: {
          show: true,
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded' as ButtonShape,
          position: 'bottom-right' as ButtonPosition
        },
        calendar: {
          show: true,
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded' as ButtonShape,
          position: 'bottom-left' as ButtonPosition
        }
      },
      textLayout: {
        contentPosition: 'middle' as TextPosition,
        spacing: 'normal'
      }
    }
  };
}
