
import { UserRole, hasRoleAccess, mapDatabaseRoleToUserRole, getEffectiveRole } from './roles';

// Re-export for backward compatibility
export type { UserRole };
export { hasRoleAccess, mapDatabaseRoleToUserRole, getEffectiveRole };

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

// Type for the getEffectiveRole function
// This maintains backward compatibility with code that imports this type
export type GetEffectiveRoleFunction = (
  accountType: string | undefined | null,
  isStaff: boolean,
  isSuperAdmin?: boolean
) => UserRole;
