import React from 'react';
import StaffManagementContent from '@/components/staff/StaffManagementContent';
import { useAuth } from '@/features/auth/context/AuthContext';

const DashboardStaffManagement = () => {
  const { effectiveRole } = useAuth();
  
  // Keep debugging to help identify role timing issues
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("DashboardStaffManagement loaded with role:", effectiveRole);
    }
  }, [effectiveRole]);
  
  // Directly render the StaffManagementContent without PermissionGuard
  return <StaffManagementContent />;
};

export default DashboardStaffManagement;
