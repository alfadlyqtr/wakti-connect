
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  business_id: string;
  created_at?: string;
  updated_at?: string;
  assigned_staff?: StaffMember[];
}

export interface ServiceFormValues {
  name: string;
  description: string;
  price: string;
  duration: string;
  assignedStaff?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
}
