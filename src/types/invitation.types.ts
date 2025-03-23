
export interface UserContactProfile {
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  email?: string;
  accountType?: string;
}

export interface UserContact {
  id: string;
  userId: string;
  contactId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  staffRelationId?: string;
  contactProfile?: UserContactProfile;
}

export interface InvitationRecipient {
  id?: string;
  name: string;
  email?: string;
  type: 'contact' | 'email';
}

export interface InvitationTemplate {
  id: string;
  name: string;
  previewImage: string;
  defaultStyles: InvitationStyle;
  createdAt: string;
}

export interface InvitationCustomization {
  id?: string;
  invitationId?: string;
  creatorId?: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundValue: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  textAlign: 'left' | 'center' | 'right';
  buttonStyles: {
    accept: {
      background: string;
      color: string;
    };
    decline: {
      background: string;
      color: string;
    };
  };
  layoutSize: 'small' | 'medium' | 'large';
  headerImage?: string | null;
  mapLocation?: string | null;
  customEffects?: {
    shadow?: boolean;
    animation?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvitationStyle {
  background: {
    type: 'solid' | 'gradient' | 'image';
    value: string;
  };
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  textAlign: 'left' | 'center' | 'right';
  buttons: {
    accept: {
      background: string;
      color: string;
    };
    decline: {
      background: string;
      color: string;
    };
  };
  shadow: boolean;
  headerStyle: 'banner' | 'simple' | 'minimal';
}

export interface InvitationRequest {
  target: InvitationTarget;
  shared_as_link: boolean;
}

export interface InvitationResponse {
  id: string;
  status: 'sent' | 'error';
  created_at: string;
}

export interface InvitationTarget {
  id: string;
  type: 'user' | 'email';
}
