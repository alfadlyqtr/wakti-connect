
import React from "react";
import StaffMemberCard from "./StaffMemberCard";
import StaffMembersLoading from "./StaffMembersLoading";
import StaffMembersError from "./StaffMembersError";
import EmptyStaffState from "./EmptyStaffState";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  created_at: string;
  staff_id: string;
}

interface StaffListProps {
  staffMembers: StaffMember[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onViewDetails: (memberId: string) => void;
  onAddStaffClick: () => void;
}

const StaffList: React.FC<StaffListProps> = ({ 
  staffMembers, 
  isLoading, 
  error, 
  onViewDetails,
  onAddStaffClick
}) => {
  if (isLoading) {
    return <StaffMembersLoading />;
  }

  if (error) {
    return <StaffMembersError errorMessage="Error loading staff members" />;
  }

  if (!staffMembers || staffMembers.length === 0) {
    return <EmptyStaffState onAddStaffClick={onAddStaffClick} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {staffMembers.map((member) => (
        <StaffMemberCard
          key={member.id}
          member={member}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default StaffList;
