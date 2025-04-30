
import { BackgroundType } from "./invitation.types";

export interface SimpleInvitation {
  id?: string;
  title: string;
  description?: string;
  datetime?: string;
  location?: string;
  location_url?: string;
  background_type: BackgroundType;
  background_value: string;
  font_family: string;
  font_size: string;
  text_color: string;
  share_link?: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateSimpleInvitationRequest = Omit<SimpleInvitation, 'id' | 'created_at' | 'updated_at' | 'share_link'>;

export interface ShareOptions {
  link: string;
  qrCode: string;
}
