
export interface BusinessProfile {
  id: string;
  business_name: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  account_type: string;
}

export interface BusinessSubscriberWithProfile {
  id: string;
  business_id: string;
  subscriber_id: string;
  created_at: string;
  profile: {
    display_name: string | null;
    full_name: string | null;
    avatar_url: string | null;
    account_type?: string;
  };
}

export interface BusinessSubscription {
  id: string;
  business_id: string;
  subscriber_id: string;
  created_at: string;
  business_profile: BusinessProfile | null;
}
