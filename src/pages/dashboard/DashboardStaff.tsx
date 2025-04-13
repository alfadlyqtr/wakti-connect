
import React from 'react';
import { useStaffMembers } from '@/hooks/useStaffMembers';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';
import StaffManagementTab from '@/components/staff/StaffManagementTab';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PermissionGuard from '@/components/auth/PermissionGuard';
import RestrictedAction from '@/components/ui/RestrictedAction';

const DashboardStaff = () => {
  const {
    staffMembers,
    isLoading,
    canAddMoreStaff,
    handleSyncStaff,
    isSyncing
  } = useStaffMembers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your staff members and their permissions
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSyncStaff} 
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <PermissionGuard featureKey="staff_create">
            <RestrictedAction featureKey="staff_create" showFallback={true}>
              <Button disabled={!canAddMoreStaff}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </RestrictedAction>
          </PermissionGuard>
        </div>
      </div>
      
      <PermissionGuard 
        featureKey="staff_management" 
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>Access Restricted</CardTitle>
              <CardDescription>You don't have permission to manage staff members</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Please contact your administrator if you need access to this feature.</p>
            </CardContent>
          </Card>
        }
      >
        <StaffManagementTab />
      </PermissionGuard>
    </div>
  );
};

export default DashboardStaff;
