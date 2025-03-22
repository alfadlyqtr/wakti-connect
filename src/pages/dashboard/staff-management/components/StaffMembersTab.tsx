
import React, { useEffect } from "react";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";
import StaffLoadingState from "./StaffLoadingState";
import StaffErrorState from "./StaffErrorState";
import EmptyStaffState from "./EmptyStaffState";
import StaffMembersList from "./StaffMembersList";
import StaffHeader from "./StaffHeader";

interface StaffMembersTabProps {
  onSelectStaff: (staffId: string) => void;
  onOpenCreateDialog: () => void;
}

const StaffMembersTab: React.FC<StaffMembersTabProps> = ({ 
  onSelectStaff, 
  onOpenCreateDialog 
}) => {
  const {
    staffMembers,
    isLoading,
    error,
    authError,
    refetch,
    handleManualRefetch
  } = useStaffMembers();

  // Refetch when component mounts to ensure we have latest data
  useEffect(() => {
    console.log("StaffMembersTab mounted - refetching data");
    refetch();
  }, [refetch]);

  const handleSelectStaffMember = (staffId: string) => {
    console.log("Staff selected in tab component:", staffId);
    onSelectStaff(staffId);
  };

  if (isLoading) {
    return <StaffLoadingState />;
  }

  if (error || authError) {
    return (
      <StaffErrorState 
        error={error} 
        authError={authError} 
        onRetry={handleManualRefetch} 
      />
    );
  }

  if (!staffMembers || staffMembers.length === 0) {
    return <EmptyStaffState onCreateStaff={onOpenCreateDialog} />;
  }

  return (
    <>
      <StaffHeader onRefresh={handleManualRefetch} />
      <StaffMembersList 
        staffMembers={staffMembers} 
        onSelectStaff={handleSelectStaffMember} 
        data-testid="staff-members-list"
      />
    </>
  );
};

export default StaffMembersTab;
