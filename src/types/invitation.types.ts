
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
