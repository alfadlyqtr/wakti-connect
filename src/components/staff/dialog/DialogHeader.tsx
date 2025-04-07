
import React from "react";
import {
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface DialogHeaderProps {
  isEditing: boolean;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ isEditing }) => {
  const { t } = useTranslation();
  
  return (
    <div className="px-6 pt-6 pb-4 border-b sticky top-0 z-20 bg-background">
      <DialogTitle className="text-xl font-semibold">
        {isEditing ? t("staff.editStaff") : t("staff.addStaff")}
      </DialogTitle>
      <DialogDescription className="mt-1">
        {isEditing ? t("staff.editDesc") : t("staff.addDesc")}
      </DialogDescription>
    </div>
  );
};

export default DialogHeader;
