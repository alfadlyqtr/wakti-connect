
import React from "react";
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StaffMemberCard, { StaffMember } from "./StaffMemberCard";

interface StaffListProps {
  staffMembers: StaffMember[] | undefined;
  isLoading: boolean;
  hasError: boolean;
  onCreateStaff: () => void;
  onEditStaff: (staff: StaffMember) => void;
  onSuspendStaff: (staff: StaffMember) => void;
  onDeleteStaff: (staff: StaffMember) => void;
  onReactivateStaff: (staff: StaffMember) => void;
}

const StaffList: React.FC<StaffListProps> = ({
  staffMembers,
  isLoading,
  hasError,
  onCreateStaff,
  onEditStaff,
  onSuspendStaff,
  onDeleteStaff,
  onReactivateStaff
}) => {
  if (isLoading) {
    return (
      <Card className="col-span-full flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="col-span-full p-8">
        <p className="text-center text-destructive">Error loading staff members</p>
      </Card>
    );
  }

  if (!staffMembers || staffMembers.length === 0) {
    return (
      <Card className="col-span-full p-8">
        <div className="text-center">
          <UserPlus className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Staff Members Yet</h3>
          <p className="text-muted-foreground mb-4">Add staff members to your business.</p>
          <Button onClick={onCreateStaff}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Staff Member
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {staffMembers.map((member) => (
        <StaffMemberCard
          key={member.id}
          member={member}
          onEdit={onEditStaff}
          onSuspend={onSuspendStaff}
          onDelete={onDeleteStaff}
          onReactivate={onReactivateStaff}
        />
      ))}
    </div>
  );
};

export default StaffList;
