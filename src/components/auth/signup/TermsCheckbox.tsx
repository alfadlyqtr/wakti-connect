
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

const TermsCheckbox: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" required />
      <Label 
        htmlFor="terms" 
        className="text-sm font-normal cursor-pointer"
      >
        {t('auth.termsAgreement')}
      </Label>
    </div>
  );
};

export default TermsCheckbox;
