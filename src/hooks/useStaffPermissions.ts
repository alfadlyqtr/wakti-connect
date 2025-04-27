
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export const useStaffPermissions = () => {
  const [isStaff, setIsStaff] = useState(false);
  const [canEditProfile, setCanEditProfile] = useState(true);
  const [canEditTheme, setCanEditTheme] = useState(true);
  const [canEditBasicInfo, setCanEditBasicInfo] = useState(true);
  const [loading, setLoading] = useState(true); // Added loading state
  const { user } = useAuth();
  
  useEffect(() => {
    const checkStaffPermissions = async () => {
      setLoading(true);
      try {
        if (user) {
          // Check if user is staff
          const { data, error } = await supabase
            .from('business_staff')
            .select('role, permissions')
            .eq('staff_id', user.id)
            .eq('status', 'active')
            .single();
          
          if (data && !error) {
            setIsStaff(true);
            
            // Set permissions based on staff role and explicit permissions
            if (data.role === 'co-admin') {
              setCanEditProfile(true);
              setCanEditTheme(true);
              setCanEditBasicInfo(false); // Co-admins can't edit basic business info
            } else {
              setCanEditProfile(false);
              setCanEditTheme(false);
              setCanEditBasicInfo(false);
              
              // Check explicit permissions
              const permissions = data.permissions as Record<string, boolean>;
              if (permissions) {
                setCanEditProfile(!!permissions.can_edit_profile);
                setCanEditTheme(!!permissions.can_edit_theme);
              }
            }
          } else {
            setIsStaff(false);
          }
        }
      } catch (error) {
        console.error('Error checking staff permissions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkStaffPermissions();
  }, [user]);
  
  return { isStaff, canEditProfile, canEditTheme, canEditBasicInfo, loading };
};
