
// Auth feature barrel export
export { default as AuthForm } from "./components/AuthForm";
export { default as LoginForm } from "./components/LoginForm";
export { default as SignupForm } from "./components/SignupForm";
export { default as SocialAuth } from "./components/SocialAuth";
export { default as AuthShell } from "./components/AuthShell";
export { default as ProtectedRoute } from "./components/ProtectedRoute";
export { default as RoleAccess } from "./components/RoleAccess";
export { default as SuperAdminGuard } from "./components/SuperAdminGuard";
export { default as BiometricSetup } from "./components/BiometricSetup";
export { default as AuthLoadingState } from "./components/AuthLoadingState";
export { default as AuthErrorState } from "./components/AuthErrorState";

// Re-export hooks
export { useAuth } from "./hooks/useAuth";
