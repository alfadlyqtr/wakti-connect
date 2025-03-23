
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import CreateStaffDialog from "./CreateStaffDialog";
import { StaffList } from "./list";
import { StaffMember } from "@/types/staff";
import { useStaffQuery } from "./list/useStaffQuery";

const StaffManagementTab: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: queryStaffMembers, isLoading, error } = useStaffQuery();

  // Convert the StaffMember[] from useStaffQuery to match the type expected by StaffList
  const staffMembers: StaffMember[] = (queryStaffMembers || []).map(staff => ({
    id: staff.id,
    staff_id: staff.staff_id,
    business_id: '', // Add required field that's missing from useStaffQuery type
    name: staff.name,
    email: staff.email || '',
    position: staff.position || '',
    role: staff.role || 'staff',
    status: 'active', // Default value
    is_service_provider: false, // Default value
    permissions: {},
    staff_number: '',
    created_at: staff.created_at
  }));

  const handleViewDetails = (memberId: string) => {
    console.log("View details for staff member:", memberId);
    // Implement view details functionality here
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Staff Members</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>
      
      <StaffList
        staffMembers={staffMembers}
        isLoading={isLoading}
        error={error}
        onEdit={handleViewDetails}
        onRefresh={() => console.log("Refreshing staff list")}
      />
      
      <CreateStaffDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
};

export default StaffManagementTab;
