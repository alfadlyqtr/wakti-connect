
export interface UserContactProfile {
  id: string;
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  accountType?: string;
}

export interface UserContact {
  id: string;
  userId: string;
  contactId: string;
  status: 'pending' | 'accepted' | 'rejected';
  staffRelationId?: string;
  contactProfile?: UserContactProfile;
}

export interface BusinessSubscription {
  id: string;
  business_id: string;
  subscriber_id: string;
  created_at: string;
  business_profile: {
    id: string;
    business_name?: string;
    display_name?: string;
    full_name?: string;
    avatar_url?: string;
    account_type: string;
  } | null;
}

export interface UserSearchResult {
  id: string;
  fullName?: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  accountType: string;
  businessName?: string;
}

export interface ContactRequestStatus {
  requestExists: boolean;
  requestStatus: string;
}

// Invitation system types
export interface InvitationRecipient {
  id: string;
  name: string;
  email?: string;
  type: 'contact' | 'email';
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
  previewImage: string;
  defaultStyles: any;
  createdAt: string;
}

export interface InvitationCustomization {
  backgroundType?: 'solid' | 'gradient' | 'image';
  backgroundValue?: string;
  fontFamily?: string;
  fontSize?: string;
  textAlign?: string;
  buttonStyles?: any;
  layoutSize?: 'small' | 'medium' | 'large';
  customEffects?: {
    shadow?: string;
  };
  creatorId?: string;
  createdAt?: string;
  updatedAt?: string;
  headerImage?: string;
  mapLocation?: string;
  invitationId?: string;
}

export interface InvitationStyle {
  background: {
    type: string;
    value: string;
  };
  font: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
  };
  layout: string;
}
