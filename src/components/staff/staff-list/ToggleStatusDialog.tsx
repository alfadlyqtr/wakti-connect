
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StaffMember } from "@/types/staff";

interface ToggleStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStaff: StaffMember | null;
  onSuccess: () => void;
}

const ToggleStatusDialog: React.FC<ToggleStatusDialogProps> = ({
  open,
  onOpenChange,
  selectedStaff,
  onSuccess
}) => {
  const handleConfirmToggle = () => {
    // This would be where you call an API to toggle the staff member's status
    onOpenChange(false);
    // After successful status toggle, call onSuccess to refresh the staff list
    onSuccess();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {selectedStaff?.status === 'active' ? 'Suspend' : 'Activate'} Staff Member
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {selectedStaff?.status === 'active' ? 'suspend' : 'activate'} {selectedStaff?.name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmToggle}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ToggleStatusDialog;
