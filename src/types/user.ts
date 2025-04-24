
import { UserRole, hasRoleAccess, getEffectiveRole } from './roles';

// Re-export for backward compatibility
export type { UserRole };
export { hasRoleAccess, getEffectiveRole };

// For legacy components that still reference 'free'
export type LegacyUserRole = UserRole | 'free';

// Deprecated re-exports with type exports
export type { hasRoleAccess as deprecatedHasRoleAccess };
export type { getEffectiveRole as deprecatedGetEffectiveRole };
