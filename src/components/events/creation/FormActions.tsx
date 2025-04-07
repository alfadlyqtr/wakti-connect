
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";

export interface FormActionsProps {
  onPrev?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
  showSubmit?: boolean;
  submitLabel?: string;
  form?: UseFormReturn<EventFormValues>;
  activeTab?: string;
  recipients?: InvitationRecipient[];
  isEditMode?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onPrev,
  onNext,
  isSubmitting = false,
  showSubmit = false,
  submitLabel = "Create Event"
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={!onPrev}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      
      {showSubmit ? (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={!onNext}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default FormActions;
