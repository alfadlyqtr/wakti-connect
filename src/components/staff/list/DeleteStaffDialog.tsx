
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
import { StaffMember } from "@/pages/dashboard/staff-management/types";

interface DeleteStaffDialogProps {
  staffToDelete: StaffMember | null;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: (staffId: string) => void;
}

const DeleteStaffDialog: React.FC<DeleteStaffDialogProps> = ({
  staffToDelete,
  onOpenChange,
  onConfirmDelete
}) => {
  return (
    <AlertDialog open={!!staffToDelete} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
          <AlertDialogDescription>
            {staffToDelete && `Are you sure you want to delete ${staffToDelete.profile?.full_name || staffToDelete.name}? This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => staffToDelete && onConfirmDelete(staffToDelete.id)}
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
