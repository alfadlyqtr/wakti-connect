
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StaffMember } from '@/pages/dashboard/staff-management/types';

interface ToggleStatusDialogProps {
  staffToToggle: StaffMember | null;
  onOpenChange: (open: boolean) => void;
  onConfirmToggle: (id: string, newStatus: string) => void;
}

const ToggleStatusDialog: React.FC<ToggleStatusDialogProps> = ({ 
  staffToToggle, 
  onOpenChange, 
  onConfirmToggle 
}) => {
  if (!staffToToggle) return null;
  
  const isActive = staffToToggle.status === 'active';
  const newStatus = isActive ? 'suspended' : 'active';
  const actionText = isActive ? 'suspend' : 'activate';
  
  return (
    <Dialog open={!!staffToToggle} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
          <DialogDescription>
            Are you sure you want to {actionText} {staffToToggle.name}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            variant={isActive ? "destructive" : "default"} 
            onClick={() => onConfirmToggle(staffToToggle.id, newStatus)}
          >
            {isActive ? 'Suspend Staff' : 'Activate Staff'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToggleStatusDialog;
