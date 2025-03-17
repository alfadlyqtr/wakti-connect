
export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  status: EventStatus;
  customization: any;
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
  status?: EventStatus;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
  customization?: any;
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
