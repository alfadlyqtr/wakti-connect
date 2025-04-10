
export interface UserSearchResult {
  id: string;
  fullName: string | null;
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
  accountType: string | null;
  businessName?: string | null;
}

export type ContactRequestStatusValue = 'accepted' | 'pending' | 'rejected' | 'none';

export interface ContactRequestStatus {
  requestExists: boolean;
  requestStatus: ContactRequestStatusValue;
}

export interface UserContact {
  id: string;
  userId: string;
  contactId: string;
  status: 'accepted' | 'pending' | 'rejected';
  staffRelationId?: string | null;
  contactProfile: UserSearchResult;
}

// New types to fix errors

export interface InvitationRecipient {
  id: string;
  name: string;
  email?: string;
  userId?: string;
  type: 'user' | 'email' | 'contact';
  status?: 'pending' | 'accepted' | 'declined';
}

export interface InvitationRequest {
  recipients: InvitationRecipient[];
  shared_as_link?: boolean;
}

export interface InvitationResponse {
  id: string;
  status: 'sent' | 'failed';
  createdAt: string;
  recipients: {
    total: number;
    accepted: number;
    pending: number;
    declined: number;
    successful: string[];
    failed: string[];
  };
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

export interface InvitationTemplate {
  id: string;
  name: string;
  previewImage: string;
  defaultStyles: Record<string, any>;
  customization: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
}
