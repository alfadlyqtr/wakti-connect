
// Re-export everything from the new structure
export * from './types';
export * from './context/AuthContext';
export * from './components';

// Export the hooks
export { useAuthState } from './hooks/useAuthState';
export { useAuthOperations } from './hooks/useAuthOperations';

// Mark old hooks as deprecated
export { useUserRole } from './hooks/useUserRole';
export { useEffectiveRole } from './hooks/useEffectiveRole';
