
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
  chatbot_position?: 'sidebar' | 'floating' | string;
  show_subscribe_button?: boolean;
  subscribe_button_text?: string; 
  created_at?: string;
  updated_at?: string;
  
  // Styling fields
  text_color?: string;
  font_family?: string;
  border_radius?: string;
  page_pattern?: string;
  
  // Enhanced customization
  background_color?: string;
  subscribe_button_position?: 'top' | 'floating' | 'both' | string;
  subscribe_button_style?: 'default' | 'gradient' | 'outline' | 'minimal' | string;
  subscribe_button_size?: 'small' | 'default' | 'large' | string;
  social_icons_style?: 'default' | 'colored' | 'rounded' | 'outlined' | string;
  social_icons_size?: 'small' | 'default' | 'large' | string;
  social_icons_position?: 'footer' | 'header' | 'sidebar' | string;
  content_max_width?: string;
  section_spacing?: 'compact' | 'default' | 'spacious' | string;
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
  
  // Section-specific styling
  background_color?: string;
  text_color?: string;
  padding?: string;
  border_radius?: string;
  background_image_url?: string;
}

export type SectionType = 
  | 'header'
  | 'about'
  | 'contact'
  | 'gallery'
  | 'testimonials'
  | 'booking'
  | 'instagram'
  | 'chatbot'; // Add chatbot as a new section type

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
  | 'website'
  | 'whatsapp';

// Section styling options
export interface SectionStyles {
  background_color?: string;
  text_color?: string;
  padding?: string;
  border_radius?: string;
  background_image_url?: string;
}

// Define allowed icon styles
export type SocialIconStyle = 'default' | 'colored' | 'rounded' | 'outlined';
export type SocialIconSize = 'small' | 'default' | 'large';
export type SocialIconPosition = 'footer' | 'header' | 'sidebar' | 'both' | 'top' | 'bottom' | 'left' | 'right';

// Define a placeholder BusinessHour interface to maintain compatibility with existing code
// This is an empty interface as we're removing the working hours functionality
export interface BusinessHour {
  id: string;
}
