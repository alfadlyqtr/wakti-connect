
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface JobCardDialogControlsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

const JobCardDialogControls: React.FC<JobCardDialogControlsProps> = ({
  onCancel,
  isSubmitting
}) => {
  return (
    <DialogFooter className="mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? "Creating..." : "Create Job Card"}
      </Button>
    </DialogFooter>
  );
};

export default JobCardDialogControls;
