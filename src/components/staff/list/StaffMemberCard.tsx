
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StaffMember } from '@/pages/dashboard/staff-management/types';

interface StaffMemberCardProps {
  member: StaffMember;
  onViewDetails: (id: string) => void;
}

const StaffMemberCard: React.FC<StaffMemberCardProps> = ({ member, onViewDetails }) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails(member.id)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="font-medium">{member.name}</div>
          <div className={`text-xs px-2 py-0.5 rounded ${
            member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {member.status}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{member.email}</div>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">Role: </span>
              {member.role}
            </div>
            <div>
              <span className="text-muted-foreground">Position: </span>
              {member.position}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffMemberCard;
