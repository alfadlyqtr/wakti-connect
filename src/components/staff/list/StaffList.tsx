
import React, { useState } from "react";
import { StaffMember } from "@/types/staff";
import StaffListHeader from "./StaffListHeader";
import StaffListContent from "./StaffListContent";
import DeleteStaffDialog from "./DeleteStaffDialog";
import ToggleStatusDialog from "./ToggleStatusDialog";
import { useStaffListOperations } from "./useStaffListOperations";

interface StaffListProps {
  staffMembers: StaffMember[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (staffId: string) => void;
  onRefresh: () => void;
}

export const StaffList: React.FC<StaffListProps> = ({
  staffMembers,
  isLoading,
  error,
  onEdit,
  onRefresh
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toggleStatusConfirmOpen, setToggleStatusConfirmOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  
  const { isSyncing, syncStaffRecords } = useStaffListOperations();

  const handleDeleteClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setDeleteConfirmOpen(true);
  };

  const handleToggleStatusClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setToggleStatusConfirmOpen(true);
  };

  return (
    <div className="space-y-4">
      <StaffListHeader
        onAddStaff={() => onEdit("")}
        onSync={syncStaffRecords}
        isSyncing={isSyncing}
      />
      
      <StaffListContent
        staffMembers={staffMembers}
        isLoading={isLoading}
        error={error}
        onAddStaff={() => onEdit("")}
        onEdit={onEdit}
        onDelete={handleDeleteClick}
        onToggleStatus={handleToggleStatusClick}
        onRefresh={onRefresh}
      />

      <DeleteStaffDialog
        staffToDelete={selectedStaff}
        onOpenChange={() => setDeleteConfirmOpen(false)}
        onConfirmDelete={() => {
          if (selectedStaff) {
            // Handle delete
            setDeleteConfirmOpen(false);
            setSelectedStaff(null);
            onRefresh();
          }
        }}
      />

      <ToggleStatusDialog
        staffToToggle={selectedStaff}
        onOpenChange={() => setToggleStatusConfirmOpen(false)}
        onConfirmToggle={(staffId, newStatus) => {
          // Handle status toggle
          setToggleStatusConfirmOpen(false);
          setSelectedStaff(null);
          onRefresh();
        }}
      />
    </div>
  );
};

export default StaffList;
