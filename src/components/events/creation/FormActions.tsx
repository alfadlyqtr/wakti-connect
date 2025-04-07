
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="flex justify-between mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={!onPrev}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {t("common.previous")}
      </Button>
      
      {showSubmit ? (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("common.loading") : submitLabel}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={!onNext}
        >
          {t("common.next")}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default FormActions;
