
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface EmptyStaffStateProps {
  onCreateStaff: () => void;
}

const EmptyStaffState: React.FC<EmptyStaffStateProps> = ({ onCreateStaff }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center p-8 space-y-4 border border-dashed rounded-lg"
      data-testid="empty-staff-state"
    >
      <div className="bg-slate-100 p-4 rounded-full">
        <UserPlus className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">No Staff Members Yet</h3>
        <p className="text-muted-foreground">
          You haven't added any staff members to your business yet.
        </p>
      </div>
      
      <Button onClick={onCreateStaff}>
        Add Staff Member
      </Button>
    </div>
  );
};

export default EmptyStaffState;
