
export type RepeatType = 'none' | 'daily' | 'weekly';

export interface Reminder {
  id: string;
  user_id: string;
  message: string;
  reminder_time: string;
  repeat_type: RepeatType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReminderNotification {
  id: string;
  reminder_id: string;
  notified_at: string;
  snoozed_until: string | null;
  is_dismissed: boolean;
}

export interface ReminderFormData {
  message: string;
  reminder_time: Date;
  repeat_type: RepeatType;
}
