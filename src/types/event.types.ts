
// Event Status Types
export type EventStatus = 'draft' | 'published' | 'canceled' | 'completed' | 'sent';

// Background Types
export type BackgroundType = 'solid' | 'gradient' | 'image' | 'ai';
export type AnimationType = 'none' | 'fade' | 'slide' | 'pop';
export type CardEffectType = 'shadow' | 'matte' | 'gloss';
export type ButtonShape = 'rounded' | 'pill' | 'square';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type MapDisplayType = 'button' | 'both' | 'qrcode';

// Event Tab Type
export type EventTab = 'my-events' | 'invited-events' | 'draft-events';

// Element Animation Types
export type ElementAnimationValue = 'none' | 'fade' | 'slide' | 'pop';
export type ElementAnimationDelay = 'none' | 'staggered' | 'sequence';

// Form Values Interface
export interface EventFormValues {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  locationTitle?: string;
  maps_url?: string;
  location_type?: string;
  isAllDay?: boolean;
  customization?: EventCustomization;
  status?: EventStatus;
}

// Event Form Data for API
export interface EventFormData {
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  location_title?: string;
  location_type?: string;
  maps_url?: string;
  is_all_day?: boolean;
  status?: EventStatus;
  customization?: EventCustomization;
  startDate?: Date;
  endDate?: Date;
  isAllDay?: boolean;
  invitations?: Array<{
    email?: string;
    invited_user_id?: string;
    status?: 'pending' | 'accepted' | 'declined';
    shared_as_link?: boolean;
  }>;
}

// Event Response from API
export interface Event {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  location?: string;
  location_title?: string;
  location_type?: 'manual' | 'google_maps';
  maps_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  customization?: EventCustomization;
  status: EventStatus;
  invitations?: EventInvitation[];
}

// Event with Invitations
export interface EventWithInvitations extends Event {
  invitations: EventInvitation[];
}

// Event Invitation
export interface EventInvitation {
  id: string;
  event_id: string;
  email?: string;
  invited_user_id?: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  shared_as_link?: boolean;
}

// Event Guest Response
export interface EventGuestResponse {
  id: string;
  event_id: string;
  name: string;
  email?: string;
  user_id?: string;
  response: 'accepted' | 'declined';
  comment?: string;
  created_at: string;
}

// Events Result Interface
export interface EventsResult {
  events: Event[];
  userRole: 'free' | 'individual' | 'business';
  canCreateEvents: boolean;
}

// Utility Button Style
interface UtilityButtonStyle {
  background: string;
  color: string;
  shape: ButtonShape;
}

// Utility Buttons
interface UtilityButtons {
  calendar?: UtilityButtonStyle;
  map?: UtilityButtonStyle;
  qr?: UtilityButtonStyle;
}

// Business Branding
interface BusinessBranding {
  logo?: string;
  slogan?: string;
}

// Card Effect - Make sure this is exported
export interface CardEffect {
  type: CardEffectType;
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
}

// Element Animations
export interface ElementAnimations {
  text?: ElementAnimationValue;
  buttons?: ElementAnimationValue;
  icons?: ElementAnimationValue;
  delay?: ElementAnimationDelay;
}

export interface EventCustomization {
  background?: {
    type: BackgroundType;
    value: string;
  };
  font?: {
    family: string;
    size: string;
    color: string;
    weight?: string;
    alignment?: TextAlign;
  };
  buttons?: {
    accept?: {
      background: string;
      color: string;
      shape: ButtonShape;
    };
    decline?: {
      background: string;
      color: string;
      shape: ButtonShape;
    };
  };
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
  headerStyle?: 'banner' | 'simple' | 'minimal';
  headerImage?: string;
  showAcceptDeclineButtons?: boolean;
  showAddToCalendarButton?: boolean;
  textShadow?: boolean;
  animation?: AnimationType;
  cardEffect?: CardEffect;
  elementAnimations?: ElementAnimations;
  branding?: BusinessBranding;
  mapDisplay?: MapDisplayType;
  poweredByColor?: string;
  utilityButtons?: UtilityButtons;
  enableAddToCalendar?: boolean;
  enableChatbot?: boolean;
}

export type EventFormTab = 'details' | 'customize' | 'share';
