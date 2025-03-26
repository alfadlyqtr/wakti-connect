
export interface InvitationRecipient {
  type: 'email' | 'contact';
  id: string;
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
  };
  status: 'pending' | 'accepted' | 'blocked';
}

export interface InvitationTemplate {
  id: string;
  name: string;
  description?: string;
  customization: InvitationCustomization;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InvitationCustomization {
  theme: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  font: string;
  layout: 'standard' | 'creative' | 'minimal';
  logo?: string;
  imageUrl?: string;
}

export interface InvitationStyle {
  background: string;
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
