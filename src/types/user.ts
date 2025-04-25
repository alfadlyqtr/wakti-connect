import { UserRole, hasRoleAccess, mapDatabaseRoleToUserRole } from './roles';

// Re-export for backward compatibility
export type { UserRole };
export { hasRoleAccess, mapDatabaseRoleToUserRole };

// Define UserProfile type needed by services
export interface UserProfile {
  id: string;
  full_name: string | null;
  display_name: string | null;
  business_name: string | null;
  occupation: string | null;
  account_type: "individual" | "business";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_searchable: boolean | null;
  theme_preference: string | null;
}

// Deprecated exports with type declaration only
// These are kept to avoid breaking existing imports
// but they don't actually provide any functionality
export type GetEffectiveRoleFunction = (
  accountType: string | undefined | null,
  isStaff: boolean,
  isSuperAdmin?: boolean
) => UserRole;

export const getEffectiveRole: GetEffectiveRoleFunction = (accountType, isStaff, isSuperAdmin = false) => {
  // Superadmin has highest priority
  if (isSuperAdmin) return 'superadmin';
  
  // Business owner takes next highest priority
  if (accountType === 'business') return 'business';
  
  // Staff (not a business owner) is next
  if (isStaff) return 'staff';
  
  // Otherwise, individual user
  return 'individual';
};
