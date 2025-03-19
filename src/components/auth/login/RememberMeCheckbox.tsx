
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface RememberMeCheckboxProps {
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
}

const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({ 
  rememberMe, 
  setRememberMe 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-2">
      <Checkbox 
        id="remember" 
        checked={rememberMe} 
        onCheckedChange={(checked) => 
          setRememberMe(checked as boolean)
        }
      />
      <Label 
        htmlFor="remember" 
        className="text-sm font-normal cursor-pointer"
      >
        {t('auth.rememberMe')}
      </Label>
    </div>
  );
};

export default RememberMeCheckbox;
