
export type ContactRequestStatusValue = 'pending' | 'accepted' | 'rejected' | null;

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

export interface UserContact {
  id: string;
  user_id: string;
  contact_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  staff_relation_id: string | null;
  created_at: string;
  contactProfile?: {
    id: string;
    fullName: string;
    displayName: string;
    email: string;
    avatarUrl: string;
    accountType: string;
    businessName?: string;
  };
}

export interface ContactsRequestsResponse {
  incoming: UserContact[];
  outgoing: UserContact[];
}
