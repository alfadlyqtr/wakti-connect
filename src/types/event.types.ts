import { z } from 'zod';

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

// Event status types
export type EventStatus = "draft" | "published" | "cancelled" | "accepted" | "declined" | "sent" | "recalled";

// Event tab types
export type EventTab = "my-events" | "invited-events" | "draft-events";

// Event form tab types
export type EventFormTab = "details" | "customize" | "share";

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
  customization?: EventCustomization;
  invitations?: EventInvitation[];
  is_recalled?: boolean;
}

// Event customization interface
export interface EventCustomization {
  // Background
  background: {
    type?: 'solid' | 'gradient' | 'image';
    value?: string;
    angle?: number;
    direction?: string;
  };
  
  // Font styles
  font: {
    family?: string;
    size?: string;
    color?: string;
    weight?: string;
    alignment?: string;
  };
  
  // Specific font customizations
  headerFont?: {
    family?: string;
    size?: string;
    color?: string;
    weight?: string;
  };
  
  descriptionFont?: {
    family?: string;
    size?: string;
    color?: string;
    weight?: string;
  };
  
  dateTimeFont?: {
    family?: string;
    size?: string;
    color?: string;
    weight?: string;
  };
  
  // Button styles
  buttons: {
    accept?: {
      background: string;
      color: string;
      shape: string;
    };
    decline?: {
      background: string;
      color: string;
      shape: string;
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
      shape: string;
    };
  };
  
  // Header styling
  headerStyle?: 'banner' | 'simple' | 'minimal';
  headerImage?: string;
  
  // Animation settings
  animations?: {
    text?: 'pop' | 'fade' | 'slide' | 'none';
    buttons?: 'pop' | 'fade' | 'slide' | 'none';
    icons?: 'pop' | 'fade' | 'slide' | 'none';
    delay?: 'none' | 'staggered' | 'sequence';
  };
  animation?: 'fade' | 'slide' | 'pop';
  
  // Card effects
  cardEffect?: {
    type?: 'shadow' | 'matte' | 'gloss';
    borderRadius?: 'none' | 'small' | 'medium' | 'large';
    border?: boolean;
    borderColor?: string;
  };
  
  // Element animations
  elementAnimations?: {
    text?: 'fade' | 'slide' | 'pop' | 'none';
    buttons?: 'fade' | 'slide' | 'pop' | 'none';
    icons?: 'fade' | 'slide' | 'pop' | 'none';
    delay?: 'none' | 'staggered' | 'sequence';
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
  
  // Legacy properties for backward compatibility
  features?: {
    showBranding?: boolean;
    showMapLocation?: boolean;
    showCountdown?: boolean;
    interactiveRSVP?: boolean;
  };
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

// Event form data type
export interface EventFormData {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isAllDay: boolean;
  customization?: EventCustomization;
  invitations?: Array<{
    email?: string;
    userId?: string;
  }>;
}

// Events result interface
export interface EventsResult {
  events: Event[];
  userRole: 'free' | 'individual' | 'business';
  canCreateEvents: boolean;
}
