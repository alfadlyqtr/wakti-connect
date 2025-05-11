
export interface BusinessHours {
  id: string;
  business_id: string;
  hours: WorkingHour[];
  is_automatic: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkingHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface BusinessSocialSettings {
  id: string;
  business_id: string;
  display_style: 'icons' | 'buttons';
  created_at: string;
  updated_at: string;
}
