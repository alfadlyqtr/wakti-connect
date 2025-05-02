
export type ContactRequestStatusValue = 'pending' | 'accepted' | 'rejected' | null;

export interface ContactRequestStatus {
  requestExists: boolean;
  requestStatus: ContactRequestStatusValue;
}

export interface UserSearchResult {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  accountType: string;
  businessName?: string;
}

export interface UserContact {
  id: string;
  user_id: string;
  contact_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  staff_relation_id: string | null;
  created_at: string;
  contactProfile?: {
    id: string;
    fullName: string;
    displayName: string;
    email: string;
    avatarUrl: string;
    accountType: string;
    businessName?: string;
  };
}

export interface ContactsRequestsResponse {
  incoming: UserContact[];
  outgoing: UserContact[];
}

// Add missing types needed by the events system
export interface InvitationRecipient {
  id: string;
  name: string;
  email?: string;
  userId?: string;
  type: 'user' | 'email';
  status?: 'pending' | 'accepted' | 'declined';
}

export interface InvitationCustomization {
  backgroundType: string;
  backgroundValue: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  textAlign: string;
  buttonStyles: {
    style: string;
    color: string;
  };
  layoutSize: string;
  customEffects: Record<string, any>;
}

export interface InvitationRequest {
  eventId: string;
  recipients: InvitationRecipient[];
  customizationId?: string;
  shared_as_link?: boolean;
}

export interface InvitationResponse {
  id: string;
  status: 'sent' | 'failed';
  recipients: InvitationRecipient[];
  failedRecipients?: string[];
  createdAt?: string;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  description?: string;
  content?: string;
  customizationId?: string;
  createdAt: string;
  updatedAt?: string;
  previewImage?: string;
  defaultStyles?: Record<string, any>;
  customization?: Record<string, any>;
  isDefault?: boolean;
}

// Simple Invitation System Types
export type BackgroundType = 'solid' | 'gradient' | 'image' | 'ai';

export interface SimpleInvitation {
  id: string;
  title: string;
  description: string;
  location?: string;
  locationTitle?: string;
  date?: string;
  time?: string;
  createdAt: string;
  updatedAt?: string;
  userId: string; // Match the database column name
  shareId?: string;
  isPublic?: boolean;
  customization: SimpleInvitationCustomization;
  isEvent?: boolean;
}

export interface SimpleInvitationCustomization {
  background: {
    type: BackgroundType;
    value: string; // Color, gradient, imageURL, or AI prompt
  };
  font: {
    family: string;
    size: string;
    color: string;
    weight?: string;
    alignment?: string;
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
  };
  headerStyle?: string;
  animation?: string;
  cardEffect?: string;
}
