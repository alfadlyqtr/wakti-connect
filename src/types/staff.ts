
export interface StaffMember {
  id: string;
  staff_id: string;
  business_id: string;
  name: string;
  email?: string;
  position?: string;
  role?: string; // Changed from 'staff' | 'co-admin' to string to match database
  status?: string; // Changed from enum to string
  is_service_provider?: boolean;
  permissions?: Record<string, boolean>;
  staff_number?: string;
  profile_image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StaffPermission {
  key: string;
  label: string;
  description: string;
  defaultValue?: boolean;
}

export interface WorkLog {
  id: string;
  staff_relation_id: string;
  start_time: string;
  end_time?: string;
  status: string;
  earnings: number;
  notes?: string;
}
