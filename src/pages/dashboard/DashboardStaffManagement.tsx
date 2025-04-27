
import React from 'react';
import { PermissionGuard } from '@/features/auth';
import StaffManagementContent from '@/components/staff/StaffManagementContent';

const DashboardStaffManagement = () => {
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
