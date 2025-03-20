
import { PermissionLevel, StaffPermissions } from "@/services/permissions/types";

export interface StaffMember {
  id: string;
  staff_id: string;
  business_id: string;
  full_name?: string;
  position?: string;
  email?: string;
  status: "pending" | "active" | "inactive";
  permissions: StaffPermissions;
  created_at: string;
  display_name?: string;
  profile_image_url?: string;
}

export interface StaffInvitation {
  id: string;
  business_id: string;
  email: string;
  token: string;
  status: "pending" | "accepted" | "expired";
  created_at: string;
  position?: string;
  permissions?: StaffPermissions;
  business_name?: string;
}

export interface WorkSession {
  id: string;
  staff_id: string;
  business_id: string;
  start_time: string;
  end_time?: string;
  status: "active" | "completed";
  created_at: string;
  earnings?: number;
  notes?: string;
}

export interface NewWorkSession {
  business_id: string;
  staff_id: string;
}

export interface EndWorkSession {
  id: string;
  earnings?: number;
  notes?: string;
}

export interface WorkLogSummary {
  total_hours: number;
  total_earnings: number;
  total_sessions: number;
}
