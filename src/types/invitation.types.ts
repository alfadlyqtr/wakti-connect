
export interface InvitationRecipient {
  id: string;
  type: 'email' | 'contact';
  name?: string;
  email?: string;
  status?: 'pending' | 'accepted' | 'declined';
}

export interface InvitationLink {
  id: string;
  link: string;
  expires_at?: string;
  uses_remaining?: number;
}

export interface UserContact {
  id: string;
  contactId: string;
  userId: string;
  contactProfile?: {
    fullName?: string;
    displayName?: string;
    avatarUrl?: string;
    accountType?: 'free' | 'individual' | 'business';
  };
  staffRelationId?: string;
  status: 'pending' | 'accepted' | 'blocked';
}

export interface InvitationTemplate {
  id: string;
  name: string;
  description?: string;
  previewImage?: string;
  defaultStyles: {
    background: {
      type: 'solid' | 'gradient' | 'image';
      value: string;
    };
    fontFamily: string;
    fontSize: 'small' | 'medium' | 'large';
    textAlign: 'left' | 'center' | 'right';
    buttons: {
      accept: { background: string; color: string };
      decline: { background: string; color: string };
    };
    shadow: boolean;
    headerStyle: 'simple' | 'banner' | 'minimal';
  };
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InvitationCustomization {
  id?: string;
  invitationId?: string;
  creatorId?: string;
  backgroundType?: 'solid' | 'gradient' | 'image';
  backgroundValue?: string;
  fontFamily?: string;
  fontSize?: 'small' | 'medium' | 'large';
  textAlign?: 'left' | 'center' | 'right';
  buttonStyles?: {
    accept: { background: string; color: string };
    decline: { background: string; color: string };
  };
  layoutSize?: 'small' | 'medium' | 'large';
  headerImage?: string;
  mapLocation?: string;
  customEffects?: {
    shadow?: boolean;
    animation?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface InvitationStyle {
  background: {
    type: 'solid' | 'gradient' | 'image';
    value: string;
  };
  font: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
  };
  layout: 'standard' | 'creative' | 'minimal';
}

export interface InvitationRequest {
  eventId: string;
  recipients: InvitationRecipient[];
  message?: string;
  templateId?: string;
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

export interface InvitationTarget {
  id: string;
  type: 'email' | 'user' | 'group';
  value: string;
}
