
import React, { useEffect } from "react";
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
  onSuccess?: () => void;
}

export const StaffDialog = ({
  staffId,
  open,
  onOpenChange,
  onSuccess
}: StaffDialogProps) => {
  const {
    form,
    isSubmitting,
    onSubmit,
    isLoading,
    isEditing
  } = useStaffDialog(onSuccess, staffId);
  
  // Handle dialog open/close with better handling of form reset
  useEffect(() => {
    if (!open) {
      // Wait for dialog animation to complete before resetting the form
      const timer = setTimeout(() => {
        if (!isSubmitting) {
          form.reset();
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [open, form, isSubmitting]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader isEditing={isEditing} />
        <DialogContentComponent 
          form={form}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          activeTab="create"
          setActiveTab={() => {}}
          handleSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          error={null}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StaffDialog;
