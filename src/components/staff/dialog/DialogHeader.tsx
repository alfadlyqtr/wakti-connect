
import React from "react";
import {
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DialogHeaderProps {
  isEditing: boolean;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ isEditing }) => {
  return (
    <div className="px-6 pt-6 pb-4 border-b sticky top-0 z-20 bg-background">
      <DialogTitle className="text-xl font-semibold">
        {isEditing ? "Edit Staff Member" : "Add Staff Member"}
      </DialogTitle>
      <DialogDescription className="mt-1">
        {isEditing ? "Update details for this staff member." : "Add a new staff member to your team."}
      </DialogDescription>
    </div>
  );
};

export default DialogHeader;
