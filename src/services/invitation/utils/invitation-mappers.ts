
import { SimpleInvitation } from '@/types/invitation.types';
import { InvitationDbRecord } from '../invitation-types';

/**
 * Map a database record to a SimpleInvitation object
 * Using explicit mapping to avoid TypeScript "excessively deep instantiation" errors
 */
export function mapDbRecordToSimpleInvitation(data: InvitationDbRecord): SimpleInvitation | null {
  if (!data) return null;

  // Create the result with explicit mappings to avoid deep type inference chains
  const result = {
    id: data.id,
    title: data.title,
    description: data.description || '',
    location: data.location || '',
    locationTitle: data.location_title || '',
    date: data.datetime ? new Date(data.datetime).toISOString().split('T')[0] : undefined,
    time: data.datetime ? new Date(data.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userId: data.user_id,
    shareId: data.share_link || data.id, // Use share_link if available or fall back to ID
    isPublic: data.is_public || false,
    isEvent: !!data.is_event,
    customization: {
      background: {
        type: (data.background_type || 'solid') as any,
        value: data.background_value || '#ffffff'
      },
      font: {
        family: data.font_family || 'system-ui, sans-serif',
        size: data.font_size || 'medium',
        color: data.text_color || '#000000',
      }
    }
  };

  // Add alignment property only if text_align exists
  if ('text_align' in data && data.text_align) {
    (result.customization.font as any).alignment = data.text_align;
  }

  // Cast to SimpleInvitation to maintain type compatibility
  return result as unknown as SimpleInvitation;
}
