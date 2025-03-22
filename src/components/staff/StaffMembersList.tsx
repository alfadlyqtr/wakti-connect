
import React, { useState } from "react";
import { StaffMember } from "@/pages/dashboard/staff-management/types";
import { useStaffListOperations } from "./list/useStaffListOperations";
import StaffMemberCard from "./list/StaffMemberCard";
import DeleteStaffDialog from "./list/DeleteStaffDialog";
import ToggleStatusDialog from "./list/ToggleStatusDialog";
import EmptyStaffState from "./list/EmptyStaffState";
import StaffDetailsDialog from "./dialog/StaffDetailsDialog";

interface StaffMembersListProps {
  onEditStaff: (staffId: string) => void;
}

const StaffMembersList: React.FC<StaffMembersListProps> = ({ onEditStaff }) => {
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const [staffToToggleStatus, setStaffToToggleStatus] = useState<StaffMember | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const { 
    staffMembers, 
    isLoading, 
    error,
    deleteStaff, 
    toggleStaffStatus 
  } = useStaffListOperations();
  
  const handleDeleteStaff = (staffId: string) => {
    deleteStaff.mutate(staffId);
    setStaffToDelete(null);
  };
  
  const handleToggleStatus = (staffId: string, newStatus: string) => {
    toggleStaffStatus.mutate({ staffId, newStatus });
    setStaffToToggleStatus(null);
  };

  const handleAddStaffClick = () => {
    // This would typically open a dialog or navigate to add staff page
    onEditStaff("new");
  };
  
  const handleViewDetails = (staffId: string) => {
    console.log("Opening staff details dialog for ID:", staffId);
    setSelectedStaffId(staffId);
    setDetailsDialogOpen(true);
  };
  
  if (isLoading) {
    return <div className="py-8 text-center">Loading staff members...</div>;
  }
  
  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Error loading staff members: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
  
  if (!staffMembers || staffMembers.length === 0) {
    return <EmptyStaffState onAddStaffClick={handleAddStaffClick} />;
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffMembers.map((staff) => (
          <StaffMemberCard
            key={staff.id}
            member={staff}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
      
      <DeleteStaffDialog
        staffToDelete={staffToDelete}
        onOpenChange={(open) => !open && setStaffToDelete(null)}
        onConfirmDelete={handleDeleteStaff}
      />
      
      <ToggleStatusDialog
        staffToToggle={staffToToggleStatus}
        onOpenChange={(open) => !open && setStaffToToggleStatus(null)}
        onConfirmToggle={handleToggleStatus}
      />
      
      <StaffDetailsDialog
        staffId={selectedStaffId}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </>
  );
};

export default StaffMembersList;
