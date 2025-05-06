
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { StaffList } from "./list";
import { StaffMember } from "@/types/staff";
import { useStaffQuery } from "./list/useStaffQuery";
import { StaffDialog } from "@/components/staff/StaffDialog";

const StaffManagementTab: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const { data: staffData, isLoading, error, refetch } = useStaffQuery();

  // Transform the API data to our application StaffMember type
  const staffMembers: StaffMember[] = React.useMemo(() => {
    if (!staffData) return [];
    
    return staffData.map(staff => ({
      id: staff.id,
      staff_id: staff.staff_id,
      business_id: staff.business_id,
      name: staff.name,
      email: staff.email || '',
      position: staff.position || '',
      role: staff.role || 'staff',
      status: staff.status || 'active',
      is_service_provider: staff.is_service_provider || false,
      permissions: staff.permissions || {},
      staff_number: staff.staff_number || '',
      profile_image_url: staff.profile_image_url,
      created_at: staff.created_at
    }));
  }, [staffData]);

  const handleOpenDialog = (staffId: string | null = null) => {
    setSelectedStaffId(staffId);
    setCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedStaffId(null);
    setCreateDialogOpen(false);
  };

  const handleSuccess = () => {
    refetch();
    handleCloseDialog();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Staff Members</h2>
        <Button onClick={() => handleOpenDialog()}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>
      
      <StaffList
        staffMembers={staffMembers}
        isLoading={isLoading}
        error={error}
        onEdit={(staffId) => handleOpenDialog(staffId)}
        onRefresh={() => refetch()}
      />
      
      <StaffDialog
        staffId={selectedStaffId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default StaffManagementTab;
