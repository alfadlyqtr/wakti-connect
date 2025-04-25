
import { useState, useEffect } from "react";
import { getStaffPermissions } from "@/services/users/staffPermissionsService";
import { useAuth } from "@/features/auth";

export const useStaffPermissions = () => {
  const [permissions, setPermissions] = useState({
    isStaff: false,
    canEditProfile: false,
    canEditTheme: true,
    canEditBasicInfo: false,
    isLoading: true
  });
  
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    const loadPermissions = async () => {
      const perms = await getStaffPermissions();
      setPermissions({
        ...perms,
        isLoading: false
      });
    };

    if (isAuthenticated) {
      loadPermissions();
    } else {
      setPermissions({
        isStaff: false,
        canEditProfile: false,
        canEditTheme: true,
        canEditBasicInfo: false,
        isLoading: false
      });
    }
  }, [isAuthenticated, userRole]);

  return permissions;
};
