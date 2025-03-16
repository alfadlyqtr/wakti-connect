
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface JobCardDialogControlsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  actionLabel?: string;
}

const JobCardDialogControls: React.FC<JobCardDialogControlsProps> = ({
  onCancel,
  isSubmitting,
  actionLabel = "Create Job Card"
}) => {
  return (
    <DialogFooter className="mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : actionLabel}
      </Button>
    </DialogFooter>
  );
};

export default JobCardDialogControls;
