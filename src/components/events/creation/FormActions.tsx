
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-between items-center pt-2 sm:pt-4 px-2 sm:px-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onPrev}
        disabled={isSubmitting}
        size={isMobile ? "sm" : "default"}
        className="text-xs sm:text-sm"
      >
        Previous
      </Button>
      
      <div className="space-x-2">
        {!showSubmit && (
          <Button 
            type="button" 
            onClick={onNext}
            disabled={isSubmitting}
            size={isMobile ? "sm" : "default"}
            className="text-xs sm:text-sm"
          >
            Next
          </Button>
        )}
        
        {showSubmit && (
          <Button 
            type="submit"
            disabled={isSubmitting}
            size={isMobile ? "sm" : "default"}
            className="text-xs sm:text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
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
