
import { useAuth } from "./auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  PermissionLevel, 
  StaffPermissions, 
  getBusinessPermissions, 
  meetsPermissionLevel,
  getUserRoleInfo,
  UserRoleInfo
} from "@/services/permissions/accessControlService";

export const useBusinessPermissions = () => {
  const { user } = useAuth();
  
  const { data: roleInfo, isLoading, error } = useQuery({
    queryKey: ["userRoleInfo", user?.id],
    queryFn: getUserRoleInfo,
    enabled: !!user,
  });
  
  const permissions = getBusinessPermissions(roleInfo);
  
  const hasPermission = (level: PermissionLevel): boolean => {
    if (!user || !roleInfo) return false;
    return meetsPermissionLevel(level, (roleInfo as UserRoleInfo).role);
  };
  
  return {
    roleInfo,
    permissions,
    hasPermission,
    isLoading,
    error,
  };
};
