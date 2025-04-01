
export interface UserContactProfile {
  id: string;
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  accountType?: string;
}

export interface UserContact {
  id: string;
  userId: string;
  contactId: string;
  status: 'pending' | 'accepted' | 'rejected';
  staffRelationId?: string;
  contactProfile?: UserContactProfile;
}

export interface BusinessSubscription {
  id: string;
  business_id: string;
  subscriber_id: string;
  created_at: string;
  business_profile: {
    id: string;
    business_name?: string;
    display_name?: string;
    full_name?: string;
    avatar_url?: string;
    account_type: string;
  } | null;
}
