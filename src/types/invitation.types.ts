
export type InvitationBackground = {
  type: 'solid' | 'gradient' | 'image';
  value: string;
};

export type InvitationButtons = {
  accept: {
    background: string;
    color: string;
  };
  decline: {
    background: string;
    color: string;
  };
};

export type InvitationStyle = {
  background: InvitationBackground;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  textAlign: 'left' | 'center' | 'right';
  buttons: InvitationButtons;
  shadow: boolean;
  headerStyle: 'banner' | 'simple' | 'minimal';
};

export interface InvitationTemplate {
  id: string;
  name: string;
  previewImage?: string;
  defaultStyles: InvitationStyle;
  createdAt: string;
}

export interface InvitationCustomization {
  id: string;
  invitationId: string;
  creatorId: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundValue?: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  textAlign: 'left' | 'center' | 'right';
  buttonStyles?: InvitationButtons;
  layoutSize: 'small' | 'medium' | 'large';
  headerImage?: string;
  mapLocation?: string;
  customEffects?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationLink {
  id: string;
  invitationId: string;
  externalAccessToken: string;
  recipientEmail: string;
  status: 'pending' | 'registered';
  createdAt: string;
  updatedAt: string;
}

export interface UserContact {
  id: string;
  userId: string;
  contactId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  // Join fields
  contactProfile?: {
    fullName?: string;
    displayName?: string;
    avatarUrl?: string;
    email?: string;
  };
}

export interface UserInvitationPreferences {
  userId: string;
  canReceiveInvitations: boolean;
  notificationPreferences: {
    email: boolean;
    push: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvitationRecipient {
  id?: string;
  name: string;
  email?: string;
  type: 'contact' | 'email';
}
