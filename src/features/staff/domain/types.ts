
import { Json } from "@/integrations/supabase/types";

export interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}

export interface StaffMember {
  id: string;
  staff_id: string;
  business_id: string;
  name: string;
  email: string;
  position: string;
  role: string;
  staff_number: string;
  is_service_provider: boolean;
  status: string;
  permissions: {
    can_view_tasks?: boolean;
    can_manage_tasks?: boolean;
    can_message_staff?: boolean;
    can_manage_bookings?: boolean;
    can_create_job_cards?: boolean;
    can_track_hours?: boolean;
    can_log_earnings?: boolean;
    can_edit_profile?: boolean;
    can_view_customer_bookings?: boolean;
    can_view_analytics?: boolean;
    [key: string]: boolean | undefined;
  };
  created_at: string;
  profile?: Profile | null;
  profile_image_url?: string | null;
}

export interface StaffPermissions {
  can_view_tasks?: boolean;
  can_manage_tasks?: boolean;
  can_message_staff?: boolean;
  can_manage_bookings?: boolean;
  can_create_job_cards?: boolean;
  can_track_hours?: boolean;
  can_log_earnings?: boolean;
  can_edit_profile?: boolean;
  can_view_customer_bookings?: boolean;
  can_view_analytics?: boolean;
  can_update_task_status?: boolean;
  can_update_booking_status?: boolean;
  can_update_profile?: boolean;
  [key: string]: boolean | undefined;
}

export interface StaffFormValues {
  fullName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  position?: string;
  isCoAdmin: boolean;
  isServiceProvider: boolean;
  permissions: StaffPermissions;
  avatar?: File | null;
  addToContacts: boolean;
}

export interface CreateStaffParams {
  fullName: string;
  email: string;
  password?: string;
  position?: string;
  isCoAdmin: boolean;
  isServiceProvider: boolean;
  permissions: StaffPermissions;
  avatar?: File | null;
  addToContacts: boolean;
}

export interface WorkLog {
  id: string;
  staff_relation_id: string;
  start_time: string;
  end_time: string | null;
  earnings: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
