
import { useEffect, useState } from 'react';
import { hasStaffPermission } from '@/utils/staffUtils';
import { useAuth } from '@/features/auth/hooks/useAuth';

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
        
        // If user is staff, they can only edit theme preferences
        if (userRole === 'staff') {
          setIsStaff(true);
          // Staff cannot edit their profile regardless of permissions
          setCanEditProfile(false);
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
    // Staff can only edit theme preferences
    canEditTheme: true, // Everyone can edit theme
    canEditBasicInfo: false // Staff cannot edit any profile info
  };
};
