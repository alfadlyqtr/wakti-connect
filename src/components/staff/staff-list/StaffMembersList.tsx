
import React from "react";
import { StaffMember } from "@/types/staff";
import { StaffMemberCard } from "../StaffMemberCard";

interface StaffMembersListProps {
  staffMembers: StaffMember[];
  onEdit: (staffId: string) => void;
  onDelete: (staff: StaffMember) => void;
  onToggleStatus: (staff: StaffMember) => void;
}

const StaffMembersList: React.FC<StaffMembersListProps> = ({
  staffMembers,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {staffMembers.map((staff) => (
        <StaffMemberCard
          key={staff.id}
          staff={staff}
          onEdit={() => onEdit(staff.id)}
          onDelete={() => onDelete(staff)} 
          onToggleStatus={() => onToggleStatus(staff)}
        />
      ))}
    </div>
  );
};

export default StaffMembersList;
