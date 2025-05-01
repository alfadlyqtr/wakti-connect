
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
  share_id?: string;
  is_public?: boolean;
  share_link?: string; // Added this property
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
    buttons?: {
      accept: {
        background: string;
        color: string;
        shape: string;
      };
      decline: {
        background: string;
        color: string;
        shape: string;
      };
      directions?: {
        show: boolean;
        background: string;
        color: string;
        shape: string;
        position: string;
      };
      calendar?: {
        show: boolean;
        background: string;
        color: string;
        shape: string;
        position: string;
      };
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
}
