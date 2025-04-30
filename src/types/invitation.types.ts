
export type ContactRequestStatusValue = "pending" | "accepted" | "rejected" | null;

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

export interface InvitationRecipient {
  id: string;
  name: string;
  email?: string;
  userId?: string;
  type: 'user' | 'email';
}

export interface UserContact {
  id: string;
  user_id: string;
  contact_id: string;
  created_at: string;
  staff_relation_id: string | null;
  contactProfile?: {
    fullName?: string;
    displayName?: string;
    email?: string;
    avatarUrl?: string;
    accountType?: string;
    businessName?: string;
  };
}

export interface ContactsRequestsResponse {
  incoming: UserContact[];
  outgoing: UserContact[];
}

export interface InvitationRequest {
  recipientIds?: string[];
  recipientEmails?: string[];
  event_id: string;
  message?: string;
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  invitationIds?: string[];
}

export interface InvitationCustomization {
  backgroundType?: string;
  backgroundValue?: string;
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  textAlign?: string;
  buttonStyles?: {
    style?: string;
    color?: string;
  };
}
