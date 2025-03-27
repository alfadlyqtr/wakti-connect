
import { useEffect, useState } from 'react';
import { hasStaffPermission } from '@/utils/staffUtils';
import { useAuth } from '@/hooks/auth';

export const useStaffPermissions = () => {
  const { user } = useAuth();
  const [isStaff, setIsStaff] = useState(false);
  const [canEditProfile, setCanEditProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setLoading(true);
        // Get user role from localStorage
        const userRole = localStorage.getItem('userRole');
        
        // If user is staff, check their specific permissions
        if (userRole === 'staff') {
          setIsStaff(true);
          // Check if staff has permission to edit their profile
          const canEdit = hasStaffPermission('can_edit_profile');
          setCanEditProfile(canEdit);
        } else {
          // Non-staff users (business owners, individuals) can always edit
          setIsStaff(false);
          setCanEditProfile(true);
        }
      } catch (error) {
        console.error("Error checking staff permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkPermissions();
    }
  }, [user]);

  return {
    isStaff,
    canEditProfile,
    loading,
    // Which fields can be edited by staff regardless of permissions
    canEditBasicInfo: isStaff, // Staff can always edit display_name and occupation
  };
};
