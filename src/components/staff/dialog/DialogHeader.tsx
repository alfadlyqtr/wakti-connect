
import React from "react";
import {
  DialogHeader as UIDialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DialogHeaderProps {
  isEditing: boolean;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ isEditing }) => {
  return (
    <UIDialogHeader>
      <DialogTitle>{isEditing ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
      <DialogDescription>
        {isEditing 
          ? "Update the staff member's information and permissions." 
          : "Add a new staff member to your business. They'll receive login credentials via email."}
      </DialogDescription>
    </UIDialogHeader>
  );
};

export default DialogHeader;
