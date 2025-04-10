
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
