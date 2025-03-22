
import React from "react";
import { StaffMember } from "../types";
import StaffMemberCard from "../StaffMemberCard";

interface StaffMembersListProps {
  staffMembers: StaffMember[];
  onSelectStaff: (staffId: string) => void;
}

const StaffMembersList: React.FC<StaffMembersListProps> = ({ 
  staffMembers, 
  onSelectStaff 
}) => {
  const handleSelectStaffMember = (staffId: string) => {
    console.log("Staff selected in list component:", staffId);
    onSelectStaff(staffId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {staffMembers.map((member) => (
        <StaffMemberCard 
          key={member.id} 
          member={member} 
          onSelectStaff={handleSelectStaffMember} 
        />
      ))}
    </div>
  );
};

export default StaffMembersList;
