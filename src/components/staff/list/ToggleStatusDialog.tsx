
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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  
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
            {isActive ? t("staff.suspend") : t("staff.activate")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive 
              ? t("staff.suspendConfirm", { name: staffToToggle.profile?.full_name || staffToToggle.name })
              : t("staff.activateConfirm", { name: staffToToggle.profile?.full_name || staffToToggle.name })
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => onConfirmToggle(staffToToggle.id, newStatus)}
            className={isActive 
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : ""
            }
          >
            {isActive ? t("staff.suspend") : t("staff.activate")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ToggleStatusDialog;
