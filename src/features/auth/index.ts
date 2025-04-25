
// Re-export everything from the new structure
export * from './types';
export { useAuth, AuthProvider } from './context/AuthContext';
export * from './components';
export * from './hooks/usePermissions';

// Export individual hooks and components
export { default as PermissionGuard } from './components/PermissionGuard';
export { default as RoleGuard } from './components/RoleGuard';
export { default as SuperAdminGuard } from './components/SuperAdminGuard';

// Export hooks with explicit names to avoid conflicts
export { useUserRole } from './hooks/useUserRole';
export { useEffectiveRole } from './hooks/useEffectiveRole';
