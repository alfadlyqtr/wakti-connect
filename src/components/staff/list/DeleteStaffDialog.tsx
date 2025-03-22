
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StaffMember } from '@/pages/dashboard/staff-management/types';

interface DeleteStaffDialogProps {
  staffToDelete: StaffMember | null;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: (id: string) => void;
}

const DeleteStaffDialog: React.FC<DeleteStaffDialogProps> = ({ 
  staffToDelete, 
  onOpenChange, 
  onConfirmDelete 
}) => {
  if (!staffToDelete) return null;
  
  return (
    <Dialog open={!!staffToDelete} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {staffToDelete.name} from your staff? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={() => onConfirmDelete(staffToDelete.id)}
          >
            Delete Staff
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStaffDialog;
