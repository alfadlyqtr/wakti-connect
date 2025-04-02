
// Types for the contacts system
export type ContactRequestStatusValue = "accepted" | "pending" | "rejected" | "none";

export interface ContactProfile {
  id: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  accountType: string | null;
  businessName?: string | null;
  email?: string | null;
}

export interface UserContact {
  id: string;
  userId: string;
  contactId: string;
  status: "accepted" | "pending" | "rejected";
  staffRelationId?: string | null;
  contactProfile: ContactProfile;
}

export interface UserSearchResult {
  id: string;
  fullName: string | null;
  displayName: string | null;
  email?: string | null;
  avatarUrl: string | null;
  accountType: string;
  businessName?: string | null;
}

export interface ContactRequestStatus {
  requestExists: boolean;
  requestStatus: ContactRequestStatusValue;
}

// Invitation types
export interface InvitationRecipient {
  id: string;
  name: string;
  email?: string;
  userId?: string;
  type: 'email' | 'user' | 'contact';
  status?: string;
}

export interface InvitationRequest {
  title: string;
  description?: string;
  eventDate: string;
  locationInfo?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  recipients: InvitationRecipient[];
  shared_as_link?: boolean;
  customization?: InvitationCustomization;
}

export interface InvitationResponse {
  id: string;
  status: 'sent' | 'draft' | 'cancelled';
  createdAt: string;
  recipients: {
    total: number;
    accepted: number;
    pending: number;
    declined: number;
    successful?: string[];
    failed?: string[];
  };
}

export interface InvitationCustomization {
  theme?: {
    primary: string;
    secondary: string;
    background: string;
  };
  font?: {
    family: string;
    size: 'small' | 'medium' | 'large';
    color: string;
  };
  buttons?: {
    accept: {
      background: string;
      color: string;
      shape: 'square' | 'rounded' | 'pill';
    };
    decline: {
      background: string;
      color: string;
      shape: 'square' | 'rounded' | 'pill';
    };
  };
  // Legacy properties for backwards compatibility
  backgroundType?: 'solid' | 'gradient' | 'image';
  backgroundValue?: string;
  fontFamily?: string;
  fontSize?: 'small' | 'medium' | 'large';
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  buttonStyles?: {
    style: 'square' | 'rounded' | 'pill';
    color: string;
  };
  layoutSize?: 'small' | 'medium' | 'large';
  customEffects?: Record<string, any>;
  headerStyle?: string;
  animation?: string;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  description?: string;
  customization: InvitationCustomization;
  createdAt: string;
  isDefault: boolean;
  previewImage?: string;
  defaultStyles?: any;
}
