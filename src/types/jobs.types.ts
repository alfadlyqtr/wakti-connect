
export type PaymentMethod = 'cash' | 'pos' | 'none';

export interface Job {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  duration: number | null; // minutes
  default_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface JobCard {
  id: string;
  staff_relation_id: string;
  job_id: string;
  work_log_id: string | null;
  start_time: string;
  end_time: string | null;
  payment_method: PaymentMethod;
  payment_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined data
  job?: Job;
  staff_name?: string;
}

export interface JobFormData {
  name: string;
  description: string;
  duration: number | null;
  default_price: number | null;
}

export interface JobCardFormData {
  job_id: string;
  start_time: string;
  end_time?: string;
  payment_method: PaymentMethod;
  payment_amount: number;
  notes?: string;
}
