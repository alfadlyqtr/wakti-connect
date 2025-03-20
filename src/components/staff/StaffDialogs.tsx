
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
import { Ban, Check, X } from "lucide-react";
import { StaffMember } from "@/types/business.types";

interface StaffDialogsProps {
  suspendingStaff: StaffMember | null;
  deletingStaff: StaffMember | null;
  reactivatingStaff: StaffMember | null;
  onSuspendingStaffChange: (staff: StaffMember | null) => void;
  onDeletingStaffChange: (staff: StaffMember | null) => void;
  onReactivatingStaffChange: (staff: StaffMember | null) => void;
  onStatusChange: (staff: StaffMember, status: 'active' | 'suspended' | 'deleted') => Promise<void>;
}

const StaffDialogs: React.FC<StaffDialogsProps> = ({
  suspendingStaff,
  deletingStaff,
  reactivatingStaff,
  onSuspendingStaffChange,
  onDeletingStaffChange,
  onReactivatingStaffChange,
  onStatusChange
}) => {
  const getStaffName = (staff: StaffMember | null) => {
    if (!staff) return '';
    return staff.full_name || staff.display_name || staff.name || 'Unnamed Staff';
  };

  return (
    <>
      {/* Suspend Staff Dialog */}
      <AlertDialog 
        open={!!suspendingStaff} 
        onOpenChange={(open) => !open && onSuspendingStaffChange(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend {getStaffName(suspendingStaff)}? They won't be able to access your business account while suspended.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-500 hover:bg-amber-600"
              onClick={() => suspendingStaff && onStatusChange(suspendingStaff, 'suspended')}
            >
              <Ban className="h-4 w-4 mr-2" />
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Staff Dialog */}
      <AlertDialog 
        open={!!deletingStaff} 
        onOpenChange={(open) => !open && onDeletingStaffChange(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {getStaffName(deletingStaff)}? This action marks the staff account as deleted but keeps the historical data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => deletingStaff && onStatusChange(deletingStaff, 'deleted')}
            >
              <X className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reactivate Staff Dialog */}
      <AlertDialog 
        open={!!reactivatingStaff} 
        onOpenChange={(open) => !open && onReactivatingStaffChange(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reactivate {getStaffName(reactivatingStaff)}? They will regain access to your business account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-500 hover:bg-green-600"
              onClick={() => reactivatingStaff && onStatusChange(reactivatingStaff, 'active')}
            >
              <Check className="h-4 w-4 mr-2" />
              Reactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StaffDialogs;
