
import { useAuth } from "../context/AuthContext";
import { UserRole } from "@/types/roles";

export const useEffectiveRole = () => {
  const { effectiveRole } = useAuth();
  
  return {
    role: effectiveRole as UserRole,
    isLoading: false,
  };
};
