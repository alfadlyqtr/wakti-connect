
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface FormHeaderProps {
  isEdit: boolean;
  onCancel?: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isEdit, onCancel }) => {
  const { t } = useTranslation();
  
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{isEdit ? t('events.edit') : t('events.create')}</CardTitle>
      {onCancel && (
        <Button variant="ghost" type="button" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
      )}
    </CardHeader>
  );
};

export default FormHeader;
