
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
  submitLabel = "Save"
}) => {
  return (
    <div className="flex justify-between items-center pt-4 px-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onPrev}
        disabled={isSubmitting}
      >
        Previous
      </Button>
      
      <div className="space-x-2">
        {!showSubmit && (
          <Button 
            type="button" 
            onClick={onNext}
            disabled={isSubmitting}
          >
            Next
          </Button>
        )}
        
        {showSubmit && (
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              submitLabel
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormActions;
