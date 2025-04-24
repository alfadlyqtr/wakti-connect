
import { UserRole, hasRoleAccess, getEffectiveRole } from './roles';

// Re-export for backward compatibility
export { UserRole, hasRoleAccess, getEffectiveRole };

// For legacy components that still reference 'free'
export type LegacyUserRole = UserRole | 'free';

/**
 * @deprecated Use types/roles.ts instead
 */
export { hasRoleAccess as hasRoleAccess };

/**
 * @deprecated Use types/roles.ts instead
 */
export { getEffectiveRole as getEffectiveRole };
