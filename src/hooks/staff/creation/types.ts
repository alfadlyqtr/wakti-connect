
export interface StaffInvitationData {
  email: string;
  name: string;
  role: string;
  position: string;
  permissions?: Record<string, boolean>;
}

export interface StaffFormData {
  email: string;
  name: string;
  role: string;
  position: string;
  permissions: Record<string, boolean>;
  avatar?: File | null;
}

export interface StaffUpdateData {
  id: string;
  name?: string;
  position?: string;
  role?: string;
  permissions?: Record<string, boolean>;
  avatar?: File | null;
}

export interface CreateStaffResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface StaffCreationResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface StaffFormValues {
  email: string;
  fullName: string;
  password: string;
  position: string;
  isCoAdmin: boolean;
  isServiceProvider: boolean;
  permissions: Record<string, boolean>;
  avatar?: File | null;
}
