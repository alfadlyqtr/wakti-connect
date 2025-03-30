
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

// Business Page Types
export interface BusinessPage {
  id: string;
  business_id: string;
  page_title: string;
  page_slug: string;
  description?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  is_published: boolean;
  chatbot_enabled?: boolean;
  chatbot_code?: string;
  show_subscribe_button?: boolean;
  subscribe_button_text?: string; 
  created_at?: string;
  updated_at?: string;
  
  // Added new fields for styling
  text_color?: string;
  font_family?: string;
  border_radius?: string;
  page_pattern?: string;
}

export interface BusinessPageSection {
  id: string;
  page_id: string;
  section_type: SectionType;
  section_order: number;
  section_content: any;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export type SectionType = 
  | 'header'
  | 'about'
  | 'contact'
  | 'gallery'
  | 'hours'
  | 'testimonials'
  | 'booking'
  | 'instagram';

export interface BusinessSocialLink {
  id: string;
  business_id: string;
  platform: SocialPlatform;
  url: string;
  created_at?: string;
}

export type SocialPlatform = 
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'pinterest'
  | 'website';
