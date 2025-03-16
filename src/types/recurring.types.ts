
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type EntityType = 'task' | 'appointment';

export interface RecurringSettings {
  id: string;
  entity_id: string;
  entity_type: EntityType;
  frequency: RecurrenceFrequency;
  interval: number;
  days_of_week?: string[];
  day_of_month?: number;
  end_date?: string;
  max_occurrences?: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface RecurringFormData {
  frequency: RecurrenceFrequency;
  interval: number;
  days_of_week?: string[];
  day_of_month?: number;
  end_date?: Date;
  max_occurrences?: number;
}

export interface RecurringInstance {
  is_recurring_instance: boolean;
  parent_recurring_id?: string;
}

// Extended types for tasks and appointments with recurring properties
export type RecurringTask = import('./task.types').Task & RecurringInstance;
export type RecurringAppointment = import('./appointment.types').Appointment & RecurringInstance;
