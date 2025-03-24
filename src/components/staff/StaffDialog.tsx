
import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import DialogHeader from "./dialog/DialogHeader";
import DialogContentComponent from "./dialog/DialogContent";
import { useStaffDialog } from "./dialog/hooks/useStaffDialog";

interface StaffDialogProps {
  staffId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function StaffDialog({
  staffId,
  open,
  onOpenChange,
  onSuccess
}: StaffDialogProps) {
  const {
    form,
    isSubmitting,
    isEditing,
    activeTab,
    setActiveTab,
    handleSubmit,
    error
  } = useStaffDialog(staffId, onSuccess, onOpenChange);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader isEditing={isEditing} />
        <DialogContentComponent 
          form={form}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}
