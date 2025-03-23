
import React from 'react';
import { StaffMember } from "@/types/staff";
import { StaffMembersList } from "@/components/staff/StaffMembersList";
import EmptyStaffState from "./EmptyStaffState";
import StaffMembersLoading from "./StaffMembersLoading";
import StaffMembersError from "./StaffMembersError";
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
  const { 
    handleToggleStatus, 
    handleDelete, 
    confirmDeleteOpen, 
    setConfirmDeleteOpen, 
    selectedStaffId 
  } = useStaffListOperations(onRefresh);

  // Show loading state
  if (isLoading) {
    return <StaffMembersLoading />;
  }

  // Show error state
  if (error) {
    return <StaffMembersError errorMessage={error.message} onRetry={onRefresh} />;
  }

  // Show empty state
  if (!staffMembers || staffMembers.length === 0) {
    return <EmptyStaffState onAddStaffClick={() => onEdit("")} />;
  }

  // Render staff list
  return (
    <>
      <StaffMembersList
        staffMembers={staffMembers}
        isLoading={isLoading}
        error={error}
        onEdit={onEdit}
        onUpdateStatus={handleToggleStatus}
      />
    </>
  );
};

export default StaffList;
