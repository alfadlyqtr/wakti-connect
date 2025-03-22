
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
