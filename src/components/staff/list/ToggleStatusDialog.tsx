
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

interface ToggleStatusDialogProps {
  staffToToggle: StaffMember | null;
  onOpenChange: (open: boolean) => void;
  onConfirmToggle: (staffId: string, newStatus: string) => void;
}

const ToggleStatusDialog: React.FC<ToggleStatusDialogProps> = ({
  staffToToggle,
  onOpenChange,
  onConfirmToggle
}) => {
  if (!staffToToggle) return null;
  
  const isActive = staffToToggle.status === 'active';
  const newStatus = isActive ? 'suspended' : 'active';
  
  return (
    <AlertDialog 
      open={!!staffToToggle} 
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? 'Suspend' : 'Activate'} Staff Member?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive 
              ? `This will suspend access for "${staffToToggle.profile?.full_name || staffToToggle.name}". They will not be able to log in until reactivated.`
              : `This will restore access for "${staffToToggle.profile?.full_name || staffToToggle.name}". They will be able to log in again.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => onConfirmToggle(staffToToggle.id, newStatus)}
            className={isActive 
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : ""
            }
          >
            {isActive ? 'Suspend' : 'Activate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ToggleStatusDialog;
