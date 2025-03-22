
import React from 'react';
import { StaffMember } from '@/pages/dashboard/staff-management/types';

interface StaffMembersListProps {
  staffMembers: StaffMember[];
  onSelectStaff: (staffId: string) => void;
}

const StaffMembersList: React.FC<StaffMembersListProps> = ({ 
  staffMembers, 
  onSelectStaff 
}) => {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      data-testid="staff-members-list"
    >
      {staffMembers.map((staff) => (
        <div 
          key={staff.id}
          className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          onClick={() => onSelectStaff(staff.id)}
        >
          <h3 className="font-medium">{staff.name}</h3>
          <p className="text-sm text-muted-foreground">{staff.email}</p>
          <div className="mt-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {staff.role}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StaffMembersList;
