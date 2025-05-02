
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType } from '@/types/invitation.types';

// Database model structure for invitations
export interface InvitationDbRecord {
  id: string;
  title: string;
  description: string;
  location?: string;
  location_url?: string;
  location_title?: string;
  datetime?: string;
  background_type: string;
  background_value: string;
  font_family: string;
  font_size: string;
  text_color: string;
  text_align?: string;
  is_event?: boolean;
  user_id: string;
  created_at: string;
  updated_at?: string;
  share_link?: string;
  is_public?: boolean;
}

// Intermediate type for breaking the deep type inference chain
// Making alignment optional to match SimpleInvitationCustomization's structure
export type SimpleInvitationResult = {
  id: string;
  title: string;
  description: string;
  location: string;
  locationTitle: string;
  date?: string;
  time?: string;
  createdAt: string;
  updatedAt?: string;
  userId: string;
  shareId?: string;
  isPublic: boolean;
  isEvent: boolean;
  customization: {
    background: {
      type: BackgroundType;
      value: string;
    };
    font: {
      family: string;
      size: string;
      color: string;
      alignment?: string;  // Optional to match the source type
      weight?: string;     // Optional to match the source type
    };
  };
}

// Type for creating a new invitation
export interface InvitationData {
  title: string;
  description: string;
  location?: string;
  location_url?: string;
  location_title?: string;
  datetime?: string;
  background_type: string;
  background_value: string;
  font_family: string;
  font_size: string;
  text_color: string;
  text_align?: string;
  is_event?: boolean;
  user_id: string;
  share_link?: string; // Using share_link instead of share_id to match database
}
