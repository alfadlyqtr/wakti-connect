
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
  // Initialize state for confirm dialogs
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [confirmToggleOpen, setConfirmToggleOpen] = React.useState(false);
  const [selectedStaff, setSelectedStaff] = React.useState<StaffMember | null>(null);
  
  // Get staff operations
  const { 
    deleteStaff, 
    toggleStaffStatus 
  } = useStaffListOperations();

  // Handle toggle status
  const handleToggleStatus = (staffId: string) => {
    const staff = staffMembers.find(s => s.id === staffId);
    if (staff) {
      setSelectedStaff(staff);
      setConfirmToggleOpen(true);
    }
  };

  // Handle delete
  const handleDelete = (staffId: string) => {
    const staff = staffMembers.find(s => s.id === staffId);
    if (staff) {
      setSelectedStaff(staff);
      setConfirmDeleteOpen(true);
    }
  };

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
        onUpdateStatus={(staffId, status) => {
          const staff = staffMembers.find(s => s.id === staffId);
          if (staff) {
            toggleStaffStatus.mutate({ staffId, newStatus: status });
          }
        }}
      />
    </>
  );
};

export default StaffList;
