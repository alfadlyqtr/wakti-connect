
import { ButtonShape, TextAlign } from './event.types';

export interface InvitationRecipient {
  id?: string;
  name: string;
  email?: string;
  invited_user_id?: string;
  userId?: string; // Adding this to fix useEventSubmission.ts error
  type: 'user' | 'email' | 'contact'; // Added 'contact' type to fix RecipientSelector errors
  status?: 'pending' | 'accepted' | 'declined';
}

export interface InvitationCustomization {
  backgroundType: string;
  backgroundValue: string;
  fontFamily: string;
  fontSize: string;
  textColor: string; // Required property that was missing
  textAlign?: TextAlign;
  buttonStyles: {
    style: ButtonShape;
    color: string;
  };
  layoutSize: 'small' | 'medium' | 'large';
  customEffects: Record<string, any>;
}

export interface InvitationPreviewProps {
  customization: InvitationCustomization;
  title: string;
  description?: string;
  eventDate?: string;
}

// Added missing types for contact-related components
export interface UserContact {
  id: string;
  userId: string;
  contactId: string;
  status: 'accepted' | 'pending' | 'rejected';
  staffRelationId?: string;
  contactProfile?: {
    id: string;
    fullName: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    accountType: string | null;
  };
}

export interface UserSearchResult {
  id: string;
  fullName: string | null;
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
  accountType: string;
  businessName?: string;
}

export interface ContactRequestStatus {
  requestExists: boolean;
  requestStatus: 'accepted' | 'pending' | 'rejected' | 'none';
}

export interface InvitationRequest {
  recipients: InvitationRecipient[];
  shared_as_link?: boolean;
}

export interface InvitationResponse {
  id: string;
  status: 'sent' | 'failed';
  recipients: {
    successful: string[];
    failed: string[];
  };
}

export interface InvitationTemplate {
  id: string;
  name: string;
  category: string;
  previewImageUrl: string;
  customization: InvitationCustomization;
}
