export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string | null;
  location_type?: 'manual' | 'google_maps';
  maps_url?: string;
  location_coordinates?: {
    latitude: number;
    longitude: number;
  };
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
  location_coordinates?: {
    latitude: number;
    longitude: number;
  };
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
  shared_as_link?: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventWithInvitations {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  is_all_day?: boolean;
  status?: string;
  customization?: any;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  is_recalled?: boolean;
  event_invitations: EventInvitation[];
}

export interface ShareOptions {
  qrCode?: string;
  shareableLink?: string;
  emails?: string[];
}
