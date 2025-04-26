
// Re-export the public API of the auth module
export { AuthProvider, useAuth } from './application/context/AuthContext';
export { useUserRole } from './application/hooks/useUserRole';
export { useEffectiveRole } from './application/hooks/useEffectiveRole';
export { usePermissions } from './application/hooks/usePermissions';
export { useAuthOperations } from './application/hooks/useAuthOperations';

// Export domain types
export type { AuthUser, User, AuthContextType, Permission, PermissionAction } from './domain/types';

// Re-export components
export { default as PermissionGuard } from './presentation/components/PermissionGuard';
export { default as RoleGuard } from './presentation/components/RoleGuard';
export { default as SuperAdminGuard } from './presentation/components/SuperAdminGuard';
export { default as ProtectedRoute } from './presentation/components/ProtectedRoute';
export { default as AuthShell } from './presentation/components/AuthShell';

// Export operations
export * from './domain/services/authService';
