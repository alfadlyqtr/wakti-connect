
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FormActionsProps {
  onCancel: () => void;
  isPending: boolean;
  isEditing: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, isPending, isEditing }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        {t('common.cancel')}
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('common.saving')}...
          </>
        ) : (
          isEditing ? t('booking.updatePreBooking') : t('booking.createPreBooking')
        )}
      </Button>
    </div>
  );
};

export default FormActions;
