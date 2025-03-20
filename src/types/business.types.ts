
import { PermissionLevel, StaffPermissions } from "@/services/permissions/types";

export interface StaffMember {
  id: string;
  staff_id: string;
  business_id: string;
  full_name?: string;
  position?: string;
  email?: string;
  status: "pending" | "active" | "inactive" | "suspended" | "deleted";
  permissions: StaffPermissions;
  created_at: string;
  display_name?: string;
  profile_image_url?: string;
  
  // Add these properties to match StaffMemberCard component's expected type
  name?: string;
  role?: string;
  staff_number?: string;
  is_service_provider?: boolean;
}

export interface StaffInvitation {
  id: string;
  business_id: string;
  email: string;
  token: string;
  status: "pending" | "accepted" | "expired";
  created_at: string;
  position?: string;
  permissions?: StaffPermissions;
  business_name?: string;
  name?: string;
}

export interface WorkSession {
  id: string;
  staff_id: string;
  business_id: string;
  start_time: string;
  end_time?: string;
  status: "active" | "completed";
  created_at: string;
  earnings?: number;
  notes?: string;
}

export interface NewWorkSession {
  business_id: string;
  staff_id: string;
}

export interface EndWorkSession {
  id: string;
  earnings?: number;
  notes?: string;
}

export interface WorkLogSummary {
  total_hours: number;
  total_earnings: number;
  total_sessions: number;
}

export interface BusinessPage {
  id: string;
  business_id: string;
  page_title: string;
  page_slug: string;
  description?: string;
  is_published: boolean;
  chatbot_enabled?: boolean;
  chatbot_code?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessPageSection {
  id: string;
  page_id: string;
  section_type: SectionType;
  section_order: number;
  section_content: any;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export type SectionType = 
  | 'header' 
  | 'about' 
  | 'services' 
  | 'gallery' 
  | 'testimonials' 
  | 'contact' 
  | 'hours'
  | 'custom';

export interface BusinessSocialLink {
  id: string;
  business_id: string;
  platform: SocialPlatform;
  url: string;
  created_at: string;
  updated_at: string;
}

export type SocialPlatform = 
  | 'facebook' 
  | 'instagram' 
  | 'twitter' 
  | 'linkedin' 
  | 'youtube' 
  | 'website'
  | 'tiktok'
  | 'pinterest'
  | 'whatsapp';

export interface BusinessProfile {
  id: string;
  business_id: string;
  business_name: string;
  description?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  display_name?: string;
  profile_image_url?: string;
  account_type?: string;
}

export interface BusinessSubscription {
  id: string;
  user_id: string;
  business_id: string;
  status: 'active' | 'cancelled';
  created_at: string;
  updated_at: string;
  business_name?: string;
  business_logo_url?: string;
  business_profile?: {
    business_name?: string;
    avatar_url?: string;
  };
}

export interface BusinessSubscriberWithProfile {
  id: string;
  user_id: string;
  business_id: string;
  status: 'active' | 'blocked';
  created_at: string;
  profile: {
    display_name?: string;
    email?: string;
    profile_image_url?: string;
    full_name?: string;
    avatar_url?: string;
  };
}
