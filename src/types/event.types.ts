import { z } from 'zod';

// Define text alignment type
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

// Define the event schema for form validation
export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isAllDay: z.boolean().optional().default(false)
});

// Define the form values type from the schema
export type EventFormValues = z.infer<typeof eventSchema>;

// Event status types - updated to match database values
export type EventStatus = "draft" | "published" | "cancelled" | "accepted" | "declined" | "sent" | "recalled";

// Event tab types
export type EventTab = "my-events" | "invited-events" | "draft-events";

// Event form tab types
export type EventFormTab = "details" | "customize" | "share";

// Event button shape types
export type ButtonShape = "rounded" | "pill" | "square";

// Event card effect types
export type CardEffectType = "shadow" | "matte" | "gloss";

// Event animation types
export type AnimationType = "fade" | "slide" | "pop" | "none";

// Define the type for form data sent to API
export interface EventFormData {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isAllDay: boolean;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
  status?: EventStatus;
  customization?: EventCustomization;
  location_type?: 'manual' | 'google_maps';
  maps_url?: string;
  invitations?: Array<{
    email?: string;
    invited_user_id?: string;
    status?: "accepted" | "declined" | "pending";
    shared_as_link?: boolean;
  }>;
}

// Background type definition
export type BackgroundType = "solid" | "gradient" | "image";

// Font weight type
export type FontWeight = "normal" | "medium" | "bold" | "light";

// Animation delay type
export type AnimationDelay = "none" | "staggered" | "sequence";

// Event customization interface
export interface EventCustomization {
  // Background
  background: {
    type: BackgroundType;
    value: string;
    angle?: number;
    direction?: string;
  };
  
  // Font styles
  font: {
    family: string;
    size: string;
    color: string;
    weight?: string;
    alignment?: TextAlign;
  };
  
  // Specific font customizations
  headerFont?: {
    family: string;
    size: string;
    color: string;
    weight?: string;
  };
  
  descriptionFont?: {
    family: string;
    size: string;
    color: string;
    weight?: string;
  };
  
  dateTimeFont?: {
    family: string;
    size: string;
    color: string;
    weight?: string;
  };
  
  // Button styles
  buttons: {
    accept: {
      background: string;
      color: string;
      shape: ButtonShape;
    };
    decline: {
      background: string;
      color: string;
      shape: ButtonShape;
    };
    style?: string;
    color?: string;
    borderRadius?: string;
  };
  
  // Utility buttons (map, calendar, etc)
  utilityButtons?: {
    [key: string]: {
      background: string;
      color: string;
      shape: ButtonShape;
    };
  };
  
  // Header styling
  headerStyle?: 'banner' | 'simple' | 'minimal';
  headerImage?: string;
  
  // Animation settings
  animation?: AnimationType;
  
  // Card effects
  cardEffect?: {
    type: CardEffectType;
    borderRadius?: "none" | "small" | "medium" | "large";
    border?: boolean;
    borderColor?: string;
  };
  
  // Element animations
  elementAnimations?: {
    text?: AnimationType;
    buttons?: AnimationType;
    icons?: AnimationType;
    delay?: AnimationDelay;
  };
  
  // Feature toggles
  enableChatbot?: boolean;
  enableAddToCalendar?: boolean;
  showAcceptDeclineButtons?: boolean;
  showAddToCalendarButton?: boolean;
  
  // Branding
  branding?: {
    logo?: string;
    slogan?: string;
  };
  
  // Other features
  mapDisplay?: 'button' | 'qrcode' | 'both';
  poweredByColor?: string;
}

// Events result interface
export interface EventsResult {
  events: Event[];
  userRole: 'free' | 'individual' | 'business';
  canCreateEvents: boolean;
}

// Event with invitations interface
export interface EventWithInvitations extends Event {
  invitations: EventInvitation[];
}

// Event invitation interface
export interface EventInvitation {
  id: string;
  email?: string;
  invited_user_id?: string;
  status: 'pending' | 'accepted' | 'declined';
  shared_as_link: boolean;
  event_id: string;
  created_at: string;
  updated_at: string;
}

// Define the event type
export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  status: EventStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
  customization: EventCustomization;
  invitations?: EventInvitation[];
  is_recalled?: boolean;
}
