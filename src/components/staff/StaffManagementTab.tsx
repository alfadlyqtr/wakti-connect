
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import CreateStaffDialog from "./CreateStaffDialog";
import { StaffList, useStaffQuery } from "./list";

const StaffManagementTab: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: staffMembers, isLoading, error } = useStaffQuery();

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
        onViewDetails={handleViewDetails}
        onAddStaffClick={() => setCreateDialogOpen(true)}
      />
      
      <CreateStaffDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
};

export default StaffManagementTab;
