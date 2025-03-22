
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DialogFooter } from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { Trash2, Loader2, Save, X } from "lucide-react";
import { EditStaffFormValues } from "./hooks/useStaffDetailsForm";

interface StaffDetailsFooterProps {
  loading: boolean;
  onDelete: () => void;
  onCancel: () => void;
  form: UseFormReturn<EditStaffFormValues>;
  handleSaveChanges: (data: EditStaffFormValues) => void;
}

export const StaffDetailsFooter: React.FC<StaffDetailsFooterProps> = ({
  loading,
  onDelete,
  onCancel,
  form,
  handleSaveChanges,
}) => {
  return (
    <>
      <Separator className="my-4" />
      
      <DialogFooter className="flex justify-between">
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          disabled={loading}
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
            disabled={loading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            type="button" 
            disabled={loading}
            onClick={form.handleSubmit(handleSaveChanges)}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
};
