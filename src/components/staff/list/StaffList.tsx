
import React, { useState } from "react";
import { StaffMember } from "@/types/staff";
import StaffListHeader from "./StaffListHeader";
import StaffListContent from "./StaffListContent";
import DeleteStaffDialog from "../staff-list/DeleteStaffDialog";
import ToggleStatusDialog from "../staff-list/ToggleStatusDialog";
import { useStaffListOperations } from "./useStaffListOperations";
import { useStaffDialogs } from "./hooks/useStaffDialogs";

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
  // Use the custom hook for dialogs management
  const { 
    deleteConfirmOpen, 
    toggleStatusConfirmOpen, 
    selectedStaff, 
    openDeleteDialog, 
    openToggleStatusDialog, 
    closeDialogs, 
    setDeleteConfirmOpen, 
    setToggleStatusConfirmOpen 
  } = useStaffDialogs();
  
  // Use the operations hook for staff operations
  const { 
    isSyncing, 
    syncStaffRecords, 
    deleteStaff, 
    toggleStaffStatus 
  } = useStaffListOperations();

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
        onDelete={openDeleteDialog}
        onToggleStatus={openToggleStatusDialog}
        onRefresh={onRefresh}
      />

      <DeleteStaffDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        selectedStaff={selectedStaff}
        onSuccess={() => {
          if (selectedStaff) {
            deleteStaff.mutate(selectedStaff.id);
            closeDialogs();
            onRefresh();
          }
        }}
      />

      <ToggleStatusDialog
        open={toggleStatusConfirmOpen}
        onOpenChange={setToggleStatusConfirmOpen}
        selectedStaff={selectedStaff}
        onSuccess={(staffId, newStatus) => {
          toggleStaffStatus.mutate({ staffId, newStatus });
          closeDialogs();
          onRefresh();
        }}
      />
    </div>
  );
};

export default StaffList;
