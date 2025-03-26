
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onPrev: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  showSubmit?: boolean;
  submitLabel?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  onPrev,
  onNext,
  isSubmitting = false,
  showSubmit = false,
  submitLabel = "Create Event"
}) => {
  return (
    <div className="pt-4 flex justify-between">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onPrev}
        className="px-6"
      >
        Back
      </Button>
      
      {showSubmit ? (
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="px-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      ) : (
        <Button 
          type="button" 
          onClick={onNext}
          className="px-6"
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default FormActions;
