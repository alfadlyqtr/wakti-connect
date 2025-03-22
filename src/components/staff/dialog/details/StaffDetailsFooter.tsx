
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { EditStaffFormValues } from "./hooks/useStaffDetailsForm";

interface StaffDetailsFooterProps {
  loading: boolean;
  onDelete: () => void;
  onCancel: () => void;
  form: UseFormReturn<EditStaffFormValues>;
  handleSaveChanges: (data: EditStaffFormValues) => Promise<void>;
}

export const StaffDetailsFooter: React.FC<StaffDetailsFooterProps> = ({
  loading,
  onDelete,
  onCancel,
  form,
  handleSaveChanges
}) => {
  return (
    <>
      <Separator className="my-4" />
      
      <DialogFooter className="flex justify-between">
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Delete Staff Member
        </Button>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            disabled={loading}
            onClick={form.handleSubmit(handleSaveChanges)}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
};
