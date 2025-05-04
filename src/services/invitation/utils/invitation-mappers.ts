
import { SimpleInvitation, SimpleInvitationCustomization } from "@/types/invitation.types";

interface InvitationDbRecord {
  id: string;
  user_id: string;
  title: string;
  description: string;
  location?: string;
  location_title?: string;
  datetime?: string;
  created_at: string;
  updated_at?: string;
  share_link?: string;
  is_public?: boolean;
  is_event?: boolean;
  background_type?: string;
  background_value?: string;
  font_family?: string;
  font_size?: string;
  font_color?: string;
  text_align?: string;
  font_alignment?: string;  // Support both column names for backward compatibility
  [key: string]: any;
}

export function mapDbRecordToSimpleInvitation(record: InvitationDbRecord): SimpleInvitation {
  console.log("Mapping DB record to SimpleInvitation:", record);

  // Extract date and time from datetime if present
  let date: string | undefined;
  let time: string | undefined;
  
  if (record.datetime) {
    try {
      const dateObj = new Date(record.datetime);
      
      // Format date as YYYY-MM-DD
      date = dateObj.toISOString().split('T')[0];
      
      // Format time as HH:MM (24-hour)
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      time = `${hours}:${minutes}`;
      
      console.log("Extracted date and time from datetime:", { date, time, originalDatetime: record.datetime });
    } catch (error) {
      console.error("Error parsing datetime:", error);
    }
  }

  // Map customization - use text_align if available, otherwise fall back to font_alignment
  const textAlignment = record.text_align || record.font_alignment || 'left';
  
  // Map customization
  const customization: SimpleInvitationCustomization = {
    background: {
      type: (record.background_type as any) || 'solid',
      value: record.background_value || '#ffffff',
    },
    font: {
      family: record.font_family || 'sans-serif',
      size: record.font_size || 'medium',
      color: record.font_color || '#000000',
      alignment: textAlignment,
    }
  };

  return {
    id: record.id,
    userId: record.user_id,
    title: record.title || 'Untitled',
    description: record.description || '',
    location: record.location,
    locationTitle: record.location_title,
    date,
    time,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    shareId: record.share_link || record.id,
    isPublic: record.is_public || false,
    isEvent: record.is_event || false,
    customization
  };
}
