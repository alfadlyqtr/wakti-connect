
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  isPending: boolean;
  isEditing: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, isPending, isEditing }) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          isEditing ? 'Update Pre-Booking' : 'Create Pre-Booking'
        )}
      </Button>
    </div>
  );
};

export default FormActions;
