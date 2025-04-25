
import { useAuth } from "../context/AuthContext";
import { UserRole } from "@/types/roles";

/**
 * Hook that returns the user's effective role
 * This is a wrapper around the auth context for better type safety and future extensibility
 */
export const useEffectiveRole = () => {
  const { effectiveRole, isLoading } = useAuth();
  
  return {
    role: effectiveRole as UserRole,
    isLoading,
  };
};
