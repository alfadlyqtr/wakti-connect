
export interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}

export interface StaffMember {
  id: string;
  staff_id: string;
  business_id: string;
  role: string;
  created_at: string;
  profile?: Profile | null;
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
