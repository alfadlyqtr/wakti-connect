
export interface InvitationDbRecord {
  id: string;
  title: string;
  description?: string;
  from_name?: string;
  location?: string;
  location_title?: string;
  location_url?: string;
  datetime?: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  share_id?: string;
  share_link?: string; // The actual field used for sharing in the database
  is_public?: boolean;
  is_event?: boolean;
  background_type?: string;
  background_value?: string;
  font_family?: string;
  font_size?: string;
  text_color?: string;
  text_align?: string;
}

export interface InvitationData {
  title: string;
  from_name?: string;
  description?: string;
  location?: string;
  location_title?: string;
  location_url?: string;
  datetime?: string;
  end_time?: string;
  is_event?: boolean;
  is_public?: boolean;
  share_link?: string;
  user_id: string;
  background_type?: string;
  background_value?: string;
  font_family?: string;
  font_size?: string;
  text_color?: string;
  text_align?: string;
}

export interface SimpleInvitationResult {
  id: string;
  title: string;
  description: string;
  fromName?: string;
  location?: string;
  locationTitle?: string;
  date?: string;
  time?: string;
  endTime?: string;
  createdAt: string;
  updatedAt?: string;
  userId: string;
  shareId?: string;
  isPublic?: boolean;
  isEvent?: boolean;
  customization: {
    background: {
      type: string;
      value: string;
    };
    font: {
      family: string;
      size: string;
      color: string;
      alignment?: string;
    };
  };
}
