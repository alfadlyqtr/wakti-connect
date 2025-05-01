
/**
 * Map a database record to a SimpleInvitation object
 * Using explicit mapping to avoid TypeScript "excessively deep instantiation" errors
 */
export function mapDbRecordToSimpleInvitation(data: InvitationDbRecord): SimpleInvitation | null {
  if (!data) return null;

  // Use intermediate type to break the deep type inference chain
  const result: SimpleInvitationResult = {
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
    shareId: data.share_id,
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
        alignment: data.text_align || 'left',
      }
    }
  };

  // Add button configurations that match the interface requirements
  result.customization.buttons = {
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
      show: !!data.location, // Show directions button if location exists
      background: '#3B82F6',
      color: '#ffffff',
      shape: 'rounded',
      position: 'bottom-right'
    },
    calendar: {
      show: !!data.is_event, // Show calendar button if it's an event
      background: '#3B82F6',
      color: '#ffffff',
      shape: 'rounded',
      position: 'bottom-left'
    }
  };

  // Cast to SimpleInvitation to maintain type compatibility
  return result as unknown as SimpleInvitation;
}
