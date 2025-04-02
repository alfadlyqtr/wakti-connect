
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

// Define the event type
export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  status: 'draft' | 'published' | 'cancelled';
  user_id: string;
  created_at: string;
  updated_at: string;
  customization?: EventCustomization;
  invitations?: any[];
}

// Event customization interface
export interface EventCustomization {
  background?: {
    type?: 'solid' | 'gradient' | 'image';
    value?: string;
  };
  font?: {
    family?: string;
    size?: string;
    color?: string;
  };
  header?: {
    style?: string;
    alignment?: string;
    size?: string;
  };
  buttons?: {
    style?: string;
    color?: string;
    borderRadius?: string;
  };
  effects?: {
    shadow?: string;
    border?: boolean;
    borderColor?: string;
    borderRadius?: string;
  };
  animations?: {
    text?: 'pop' | 'fade' | 'slide' | 'none';
    buttons?: 'pop' | 'fade' | 'slide' | 'none';
    icons?: 'pop' | 'fade' | 'slide' | 'none';
    delay?: 'none' | 'staggered' | 'sequence';
  };
  features?: {
    showBranding?: boolean;
    showMapLocation?: boolean;
    showCountdown?: boolean;
    interactiveRSVP?: boolean;
  };
}

// Event with invitations interface
export interface EventWithInvitations extends Event {
  invitations: Array<{
    id: string;
    email?: string;
    invited_user_id?: string;
    status: 'pending' | 'accepted' | 'declined';
    shared_as_link: boolean;
  }>;
}
