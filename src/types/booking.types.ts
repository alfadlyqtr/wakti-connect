export interface Booking {
  id: string;
  business_id: string;
  service_id?: string;
  customer_id?: string;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  staff_assigned_id?: string;
  staff_name?: string;
  created_at: string;
  updated_at: string | null;
  price?: number;
  is_acknowledged?: boolean;
  acknowledged_at?: string | null;
  is_no_show?: boolean;
  no_show_at?: string | null;
  no_show_pending_approval?: boolean;
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
  
  is_template?: boolean;
  duration?: number;
  price?: number;
  is_published?: boolean;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no_show";

export type BookingDisplayStatus = BookingStatus | "template";

export type BookingTab = "all-bookings" | "pending-bookings" | "staff-bookings" | "templates" | "no-show-bookings";

export interface BookingFormData {
  title: string;
  description?: string;
  service_id?: string;
  customer_id?: string;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  status?: BookingStatus;
  start_time?: string;
  end_time?: string;
  staff_assigned_id?: string;
  staff_name?: string;
  business_id?: string;
  price?: number;
  
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
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingTemplateException {
  id: string;
  template_id: string;
  exception_date: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingTemplateFormData {
  name: string;
  description?: string | null;
  duration: number;
  price?: number | null;
  service_id?: string | null;
  staff_assigned_ids?: string[];
  is_published?: boolean;
  max_daily_bookings?: number | null;
  default_starting_hour?: number;
  default_ending_hour?: number;
  business_id?: string;
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

export type BookingUpdateData = {
  status?: BookingStatus;
  is_acknowledged?: boolean;
  acknowledged_at?: string | null;
  is_no_show?: boolean;
  no_show_at?: string | null;
  no_show_pending_approval?: boolean;
};
