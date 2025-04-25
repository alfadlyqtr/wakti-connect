
import React from 'react';
import { PermissionGuard } from '@/features/auth';
import StaffManagementContent from '@/components/staff/StaffManagementContent';
import { useAuth } from '@/features/auth';

const DashboardStaffManagement = () => {
  const { userRole } = useAuth();
  const isBusiness = userRole === 'business' || userRole === 'superadmin';
  
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
