import { z } from 'zod';

// Define text alignment type
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

// Define the event schema for form validation
export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  location_title: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isAllDay: z.boolean().optional().default(false)
});

// Define the form values type from the schema
export type EventFormValues = z.infer<typeof eventSchema>;

// Event status types - updated to match database values
export type EventStatus = "draft" | "published" | "cancelled" | "accepted" | "declined" | "sent" | "recalled";

// Database event status - must match what's in the database
export type DbEventStatus = "draft" | "sent" | "accepted" | "declined" | "recalled";

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
  location_title?: string;
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

// Background type definition - expanded to include gradient
export type BackgroundType = "solid" | "gradient" | "image";

// Gradient direction type
export type GradientDirection = "to-r" | "to-l" | "to-b" | "to-t" | "to-br" | "to-bl" | "to-tr" | "to-tl";

// Gradient color stop
export interface GradientColorStop {
  color: string;
  position: number;
}

// Font weight type
export type FontWeight = "normal" | "medium" | "bold" | "light";

// Animation delay type
export type AnimationDelay = "none" | "staggered" | "sequence";

// Event customization interface
export interface EventCustomization {
  // Background - updated to support gradients
  background: {
    type: BackgroundType;
    value: string;
    // Gradient specific properties
    gradient?: {
      angle?: number;
      direction?: GradientDirection;
      colorStops?: GradientColorStop[];
      isRadial?: boolean;
    };
  };
  
  // Font styles
  font: {
    family: string;
    size: string;
    color: string;
    weight?: FontWeight;
    alignment?: TextAlign;
  };
  
  // Specific font customizations
  headerFont?: {
    family: string;
    size: string;
    color: string;
    weight?: FontWeight;
    alignment?: TextAlign;
  };
  
  descriptionFont?: {
    family: string;
    size: string;
    color: string;
    weight?: FontWeight;
    alignment?: TextAlign;
  };
  
  dateTimeFont?: {
    family: string;
    size: string;
    color: string;
    weight?: FontWeight;
    alignment?: TextAlign;
  };
  
  locationFont?: {
    family: string;
    size: string;
    color: string;
    weight?: FontWeight;
  };
  
  // Button styles
  buttons: {
    accept: {
      background: string;
      color: string;
      shape: ButtonShape;
      text?: string;
    };
    decline: {
      background: string;
      color: string;
      shape: ButtonShape;
      text?: string;
      isVisible?: boolean;
    };
    style?: string;
    color?: string;
    borderRadius?: string;
    position?: "left" | "center" | "right" | "spaced";
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
  headerStyle?: 'banner' | 'simple' | 'minimal' | 'custom';
  headerImage?: string;
  headerHeight?: string;
  headerAlignment?: TextAlign;
  
  // Footer styling
  footerStyle?: 'simple' | 'detailed' | 'minimal' | 'none';
  footerText?: string;
  footerBackground?: string;
  footerTextColor?: string;
  
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
  mapDisplay?: 'button' | 'embedded' | 'both' | 'none';
  poweredByColor?: string;
  
  // Share options
  shareOptions?: {
    whatsapp?: boolean;
    email?: boolean;
    sms?: boolean;
    copyLink?: boolean;
    qrCode?: boolean;
  };
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
  location_title?: string;
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
  location_type?: 'manual' | 'google_maps';
  maps_url?: string;
  sender_name?: string;
}

// New type for guest responses (non-WAKTI users)
export interface EventGuestResponse {
  id: string;
  event_id: string;
  name: string;
  response: 'accepted' | 'declined';
  created_at: string;
}
