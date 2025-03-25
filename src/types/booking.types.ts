export interface Booking {
  id: string;
  business_id: string;
  service_id?: string;
  customer_id?: string;
  customer_email?: string;
  customer_name?: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  staff_assigned_id?: string;
  created_at: string;
  updated_at: string | null;
}

export interface ServiceRelation {
  name: string;
  description: string | null;
  price: number | null;
}

export interface StaffRelation {
  name: string;
}

export interface BookingWithRelations extends Booking {
  service: ServiceRelation | null;
  staff: StaffRelation | null;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type BookingTab = "all-bookings" | "pending-bookings" | "staff-bookings";

export interface BookingFormData {
  title: string;
  description?: string;
  service_id?: string;
  customer_id?: string;
  customer_email?: string;
  customer_name?: string;
  status?: BookingStatus;
  start_time?: string;
  end_time?: string;
  staff_assigned_id?: string;
  business_id?: string;
  
  // Form-specific fields (used in form UI but transformed before API calls)
  date?: Date;
  startTime?: string;
  endTime?: string;
}

export interface BookingsResult {
  bookings: BookingWithRelations[];
  userRole: "business";
}

export interface BookingTemplate {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number | null;
  service_id: string | null;
  staff_assigned_id: string | null;
  is_published: boolean;
  max_daily_bookings: number | null;
  default_starting_hour: number;
  default_ending_hour: number;
  created_at: string;
  updated_at: string;
}

export interface BookingTemplateWithRelations extends BookingTemplate {
  service: ServiceRelation | null;
  staff: StaffRelation | null;
}

export interface BookingTemplateAvailability {
  id: string;
  template_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time: string; // Format: "HH:MM" in 24-hour
  end_time: string; // Format: "HH:MM" in 24-hour
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingTemplateException {
  id: string;
  template_id: string;
  exception_date: string; // ISO date string
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingTemplateFormData {
  name: string;
  description?: string;
  duration: number;
  price?: number;
  service_id?: string;
  staff_assigned_id?: string;
  is_published?: boolean;
  max_daily_bookings?: number;
  default_starting_hour?: number; 
  default_ending_hour?: number;
}

export interface AvailableTimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface BookingTemplatesResult {
  templates: BookingTemplateWithRelations[];
  userRole: "business";
}
