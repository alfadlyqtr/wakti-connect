
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
  const { t } = useTranslation();
  
  return (
    <AlertDialog open={!!staffToDelete} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("staff.deleteStaff")}</AlertDialogTitle>
          <AlertDialogDescription>
            {staffToDelete && t("staff.deleteConfirm", { name: staffToDelete.profile?.full_name || staffToDelete.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => staffToDelete && onConfirmDelete(staffToDelete.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStaffDialog;
