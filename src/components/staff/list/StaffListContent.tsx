
import React from "react";
import { StaffMember } from "@/types/staff";
import StaffMembersLoading from "./StaffMembersLoading";
import StaffMembersError from "./StaffMembersError";
import EmptyStaffState from "./EmptyStaffState";
import { StaffMembersList } from "./StaffMembersList";

interface StaffListContentProps {
  staffMembers: StaffMember[];
  isLoading: boolean;
  error: Error | null;
  onAddStaff: () => void;
  onEdit: (staffId: string) => void;
  onDelete: (staff: StaffMember) => void;
  onToggleStatus: (staff: StaffMember) => void;
  onRefresh: () => void;
}

const StaffListContent: React.FC<StaffListContentProps> = ({
  staffMembers,
  isLoading,
  error,
  onAddStaff,
  onEdit,
  onDelete,
  onToggleStatus,
  onRefresh
}) => {
  if (isLoading) {
    return <StaffMembersLoading />;
  }

  if (error) {
    return (
      <StaffMembersError 
        errorMessage={error.message} 
        onRetry={onRefresh}
      />
    );
  }

  if (!staffMembers || staffMembers.length === 0) {
    return <EmptyStaffState onAddStaffClick={onAddStaff} />;
  }

  return (
    <StaffMembersList
      staffMembers={staffMembers}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleStatus={onToggleStatus}
    />
  );
};

export default StaffListContent;
