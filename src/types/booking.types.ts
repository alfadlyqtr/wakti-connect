
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
  updated_at: string;
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
  
  // Form-specific fields (used in form UI but transformed before API calls)
  date?: Date;
  startTime?: string;
  endTime?: string;
}

export interface BookingsResult {
  bookings: Booking[];
  userRole: "business";
}
