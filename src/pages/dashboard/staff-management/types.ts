
export interface StaffMember {
  id: string;
  business_id: string;
  staff_id: string;
  name: string;
  email: string;
  position: string;
  role: string;
  status: string;
  created_at: string;
  permissions: Record<string, boolean>;
  profile?: {
    avatar_url?: string;
    full_name?: string;
  };
}
