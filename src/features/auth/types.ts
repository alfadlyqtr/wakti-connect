import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { UserRole } from "@/types/roles";

export interface AppUser extends SupabaseUser {
  name?: string;
  displayName?: string;
  role?: UserRole;
  effectiveRole?: UserRole;
  account_type?: string;
  full_name?: string;
  avatar_url?: string;
  plan?: UserRole;
}

export type User = AppUser;

export interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  effectiveRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  logout: () => Promise<void>;
  register: (
    email: string, 
    password: string, 
    name?: string, 
    accountType?: string, 
    businessName?: string
  ) => Promise<{ error: any; data?: any }>;
  refreshUserRole: () => Promise<void>;
}

export type PermissionAction = 
  | 'approve' | 'assign' | 'create' | 'delete' | 'edit' 
  | 'export' | 'generate' | 'invite' | 'log' | 'message' 
  | 'reject' | 'send' | 'track' | 'update' | 'upload' 
  | 'view' | 'access_tasks' | 'access_events' | 'access_bookings' 
  | 'access_jobs' | 'access_services' | 'access_staff' 
  | 'access_business_page' | 'access_analytics' | 'access_reports' 
  | 'access_ai' | 'voice_recording' | 'meeting_transcription' 
  | 'notifications' | 'contacts' | 'subscribers' | 'calendar' 
  | 'search_users' | 'manage_accounts' | 'impersonate_users' 
  | 'change_passwords' | 'suspend_accounts' | 'grant_free_access' 
  | 'access_settings' | 'audit_logs' | 'hidden_route_access';

export interface Permission {
  action: PermissionAction;
  allowed: boolean;
}
