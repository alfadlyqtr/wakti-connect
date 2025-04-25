
// Re-export everything from the new structure
export * from './types';
export * from './context/AuthContext';
export * from './components';
export * from './hooks/useAuth';
export * from './hooks/usePermissions';

// Export individual hooks and components
export { default as PermissionGuard } from './components/PermissionGuard';
export { default as RoleGuard } from './components/RoleGuard';
export { default as SuperAdminGuard } from './components/SuperAdminGuard';

// Mark old hooks as deprecated if needed
export { useUserRole } from './hooks/useUserRole';
export { useEffectiveRole } from './hooks/useEffectiveRole';
