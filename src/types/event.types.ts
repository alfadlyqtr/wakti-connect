
export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string | null;
  location_type?: 'manual' | 'google_maps';
  maps_url?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  status: EventStatus;
  customization: EventCustomization;
  is_recalled: boolean;
  created_at: string;
  updated_at: string;
  invitations?: EventInvitation[];
}

export type EventStatus = "draft" | "sent" | "accepted" | "declined" | "recalled";

export type EventTab = "my-events" | "invited-events" | "draft-events";

export interface EventFormData {
  title: string;
  description?: string;
  location?: string;
  location_type?: 'manual' | 'google_maps';
  maps_url?: string;
  status?: EventStatus;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
  customization?: EventCustomization;
  invitees?: string[];
  
  // Form-specific fields (used in form UI but transformed before API calls)
  date?: Date;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
}

export interface EventsResult {
  events: Event[];
  userRole: "free" | "individual" | "business";
}

export interface EventInvitation {
  id: string;
  event_id: string;
  invited_user_id?: string;
  email?: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  shared_as_link: boolean;
}

export interface EventCustomization {
  // Background options
  background: {
    type: 'color' | 'gradient' | 'image';
    value: string; // hex color, gradient string, or image URL
  };
  
  // Text styling
  font: {
    family: string;
    size: 'small' | 'medium' | 'large';
    color: string;
  };
  
  // Button styling
  buttons: {
    accept: {
      background: string;
      color: string;
      shape: 'rounded' | 'pill' | 'square';
    };
    decline: {
      background: string;
      color: string;
      shape: 'rounded' | 'pill' | 'square';
    };
  };
  
  // Business branding
  branding?: {
    logo?: string;
    slogan?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
  };
  
  // Animation
  animation?: 'fade' | 'slide' | 'pop';
  
  // Header style
  headerStyle: 'banner' | 'simple' | 'minimal';
  
  // Social links
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  
  // Additional features
  enableChatbot?: boolean;
  enableAddToCalendar?: boolean;
  
  // Photo/image
  headerImage?: string;
}

export interface ShareOptions {
  qrCode?: string;
  shareableLink?: string;
  emails?: string[];
}
