
export interface BusinessPage {
  id: string;
  business_id: string;
  page_slug: string;
  page_title: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string;
  secondary_color: string;
  is_published: boolean;
  chatbot_enabled: boolean;
  chatbot_code?: string;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessPageSection {
  id: string;
  page_id: string;
  section_type: SectionType;
  section_order: number;
  section_title: string | null;
  section_content: any; // JSONB from database
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export type SectionType = 
  'header' | 
  'services' | 
  'hours' | 
  'contact' | 
  'gallery' | 
  'about' |
  'testimonials';

export interface BusinessSocialLink {
  id: string;
  business_id: string;
  platform: SocialPlatform;
  url: string;
  created_at: string;
  updated_at: string;
}

export type SocialPlatform = 
  'facebook' | 
  'instagram' | 
  'twitter' | 
  'linkedin' | 
  'youtube' | 
  'pinterest' | 
  'tiktok' | 
  'website' |
  'whatsapp' |
  'telegram' |
  'googlereview';

export interface BusinessSubscriber {
  id: string;
  business_id: string;
  subscriber_id: string;
  subscription_date: string;
  last_interaction_date: string | null;
  interaction_count: number;
  status: 'active' | 'inactive' | 'blocked';
  created_at: string;
}

export interface BusinessSubscriberWithProfile extends BusinessSubscriber {
  profile: {
    display_name: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}
