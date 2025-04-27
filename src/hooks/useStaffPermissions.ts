
import { useState, useEffect } from "react";
import { getStaffPermissions } from "@/services/users/staffPermissionsService";

export const useStaffPermissions = () => {
  const [permissions, setPermissions] = useState({
    isStaff: false,
    canEditProfile: false,
    canEditTheme: true,
    canEditBasicInfo: false
  });

  useEffect(() => {
    const loadPermissions = async () => {
      const perms = await getStaffPermissions();
      setPermissions(perms);
    };

    loadPermissions();
  }, []);

  return permissions;
};
