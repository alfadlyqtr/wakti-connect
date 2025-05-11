
import { SimpleInvitation } from '@/types/invitation.types';
import { InvitationDbRecord } from '../invitation-types';

/**
 * Maps a database record to a SimpleInvitation object
 */
export function mapDbRecordToSimpleInvitation(record: InvitationDbRecord): SimpleInvitation {
  return {
    id: record.id,
    title: record.title,
    description: record.description || '',
    location: record.location || undefined,
    locationTitle: record.location_title || undefined,
    date: record.datetime || undefined,
    time: record.datetime || undefined,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    userId: record.user_id,
    shareId: record.share_link,
    isPublic: record.is_public || false,
    isEvent: record.is_event || false,
    customization: {
      background: {
        type: record.background_type as any,
        value: record.background_value,
      },
      font: {
        family: record.font_family,
        size: record.font_size,
        color: record.text_color || record.font_color || '#000000',
        alignment: record.text_align,
      }
    }
  };
}
