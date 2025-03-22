
import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/mocks/translationMock";

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  const { t } = useTranslation();
  
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{t('auth.creatingAccount')}</span>
        </div>
      ) : (
        <span>{t('auth.createAccount')}</span>
      )}
    </Button>
  );
};

export default SubmitButton;
