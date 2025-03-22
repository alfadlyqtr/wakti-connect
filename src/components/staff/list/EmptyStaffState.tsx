
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface EmptyStaffStateProps {
  onAddStaffClick: () => void;
}

const EmptyStaffState: React.FC<EmptyStaffStateProps> = ({ onAddStaffClick }) => {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <UserPlus className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Staff Members Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Add staff members to your business. Staff members can help manage tasks, bookings, and more.
        </p>
        <Button onClick={onAddStaffClick}>
          Add Staff Member
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyStaffState;
