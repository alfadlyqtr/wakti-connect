
import { InvitationDbRecord } from './invitation-types';
import { SimpleInvitation, BackgroundType, ButtonPosition } from '@/types/invitation.types';

/**
 * Maps a database record to a SimpleInvitation object
 * Uses a simplified approach to avoid TypeScript "excessively deep instantiation" errors
 */
export function mapDbRecordToSimpleInvitation(data: InvitationDbRecord): SimpleInvitation | null {
  if (!data) return null;

  // Create the base invitation object with primitive properties first
  const invitation: SimpleInvitation = {
    id: data.id,
    title: data.title,
    description: data.description || '',
    location: data.location || '',
    locationTitle: data.location_title || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userId: data.user_id,
    shareId: data.share_id,
    isPublic: data.is_public || false,
    isEvent: !!data.is_event,
    // Handle date properties
    date: data.datetime ? new Date(data.datetime).toISOString().split('T')[0] : undefined,
    time: data.datetime ? new Date(data.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
    
    // Initialize customization with explicit type
    customization: {
      background: {
        type: (data.background_type || 'solid') as BackgroundType,
        value: data.background_value || '#ffffff'
      },
      font: {
        family: data.font_family || 'system-ui, sans-serif',
        size: data.font_size || 'medium',
        color: data.text_color || '#000000',
        alignment: data.text_align || 'left',
      },
      buttons: {
        accept: {
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded',
        },
        decline: {
          background: '#EF4444',
          color: '#ffffff',
          shape: 'rounded',
        },
        directions: {
          show: !!data.location,
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded',
          position: 'bottom-right' as ButtonPosition
        },
        calendar: {
          show: !!data.is_event,
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded',
          position: 'bottom-left' as ButtonPosition
        }
      }
    }
  };

  return invitation;
}
