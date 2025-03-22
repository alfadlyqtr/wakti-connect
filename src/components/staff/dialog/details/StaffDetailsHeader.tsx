
import React from "react";
import { UserIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const StaffDetailsHeader: React.FC = () => {
  return (
    <DialogHeader>
      <div className="flex items-center gap-2">
        <UserIcon className="h-5 w-5 text-primary" />
        <DialogTitle>Staff Details</DialogTitle>
      </div>
    </DialogHeader>
  );
};

export default StaffDetailsHeader;
