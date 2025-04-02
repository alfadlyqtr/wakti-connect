
import { ButtonShape, TextAlign } from './event.types';

export interface InvitationRecipient {
  id?: string;
  name: string;
  email?: string;
  invited_user_id?: string;
  type: 'email' | 'user';
  status?: 'pending' | 'accepted' | 'declined';
}

export interface InvitationCustomization {
  backgroundType: string;
  backgroundValue: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  textAlign?: TextAlign;
  buttonStyles: {
    style: ButtonShape;
    color: string;
  };
  layoutSize: 'small' | 'medium' | 'large';
  customEffects: Record<string, any>;
}

export interface InvitationPreviewProps {
  customization: InvitationCustomization;
  title: string;
  description?: string;
  eventDate?: string;
}
