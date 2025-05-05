
import React from 'react';
import { PermissionGuard } from '@/features/auth';
import StaffManagementContent from '@/components/staff/StaffManagementContent';
import { useAuth } from '@/features/auth/context/AuthContext';

const DashboardStaffManagement = () => {
  const { effectiveRole } = useAuth();
  
  // Add debugging to help identify role timing issues
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("DashboardStaffManagement loaded with role:", effectiveRole);
    }
  }, [effectiveRole]);
  
  return (
    <PermissionGuard 
      feature="staff_management"
      redirectTo="/dashboard"
      showToast={true}
    >
      <StaffManagementContent />
    </PermissionGuard>
  );
};

export default DashboardStaffManagement;
