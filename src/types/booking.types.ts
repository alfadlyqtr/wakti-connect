
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  title: string;
  description?: string;
  customer_name?: string;
  customer_email?: string;
  customer_id?: string;
  business_id: string;
  service_id?: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  staff_assigned_id?: string;
  created_at?: string;
  updated_at?: string;
  business_services?: {
    name: string;
    price: number;
    duration: number;
  };
  business_staff?: {
    name: string;
  };
}

export type BookingTab = "all-bookings" | "pending-bookings" | "staff-bookings";

export interface BookingFormData {
  title: string;
  description?: string;
  customer_name?: string;
  customer_email?: string;
  customer_id?: string;
  service_id?: string;
  start_time: string;
  end_time: string;
  status?: BookingStatus;
  staff_assigned_id?: string;
}

export interface BookingsResult {
  bookings: Booking[];
  userRole: "business" | "individual";
}
