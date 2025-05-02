
export interface EventCustomization {
  background?: {
    type: 'solid' | 'gradient' | 'image' | 'ai';
    value: string;
  };
  font?: {
    family: string;
    size: string;
    color: string;
    weight?: string;
    alignment?: string;
  };
  buttons?: {
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
  headerStyle?: string;
  showAcceptDeclineButtons?: boolean;
  showAddToCalendarButton?: boolean;
  textShadow?: boolean; // Added text shadow toggle option
}

export type EventFormTab = 'details' | 'customize' | 'share';

export interface EventInvitee {
  id: string;
  name?: string;
  email: string;
  status?: 'pending' | 'accepted' | 'declined';
}
