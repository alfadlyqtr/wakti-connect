
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

interface DeleteStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStaff: StaffMember | null;
  onSuccess: () => void;
}

const DeleteStaffDialog: React.FC<DeleteStaffDialogProps> = ({
  open,
  onOpenChange,
  selectedStaff,
  onSuccess
}) => {
  const handleConfirmDelete = () => {
    // This would be where you call an API to delete the staff member
    onOpenChange(false);
    // After successful deletion, call onSuccess to refresh the staff list
    onSuccess();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedStaff?.name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStaffDialog;
