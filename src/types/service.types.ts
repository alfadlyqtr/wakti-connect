
export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  duration: number;
  created_at: string;
  updated_at: string;
  business_id?: string;
  assigned_staff?: StaffMember[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
}

export interface ServiceFormValues {
  name: string;
  description: string;
  price: string; // String for form handling, will be converted to number
  duration: string; // String for form handling, will be converted to number
  staff_ids?: string[]; // Optional array of staff IDs
}
