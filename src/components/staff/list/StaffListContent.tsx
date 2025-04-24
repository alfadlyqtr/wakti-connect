
import React from "react";
import { StaffMember } from "@/types/staff";
import StaffMemberCard from "../StaffMemberCard";

interface StaffListContentProps {
  staffMembers: StaffMember[];
  onEdit: (staffId: string) => void;
  onDelete: (staff: StaffMember) => void;
  onToggleStatus: (staff: StaffMember) => void;
}

const StaffListContent: React.FC<StaffListContentProps> = ({
  staffMembers,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  return (
    <div className="bg-card border rounded-b-lg divide-y">
      {staffMembers.map(staff => (
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

export default StaffListContent;
