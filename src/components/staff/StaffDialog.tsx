
import React, { useState } from "react";
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

export const StaffDialog = ({
  staffId,
  open,
  onOpenChange,
  onSuccess
}: StaffDialogProps) => {
  const [activeTab, setActiveTab] = useState("create");
  const {
    form,
    isSubmitting,
    onSubmit
  } = useStaffDialog(onSuccess);
  
  // Determine if we are editing based on staffId
  const isEditing = !!staffId;
  
  // Handle the form submission
  const handleSubmit = async (values: any) => {
    await onSubmit(values);
  };
  
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
          error={null}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StaffDialog;
