
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface AccountTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label htmlFor="account-type">{t('auth.accountType')}</Label>
      <RadioGroup 
        defaultValue="free" 
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-2 pt-2"
      >
        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="free" id="free" />
          <Label htmlFor="free" className="cursor-pointer">{t('auth.free')}</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="individual" id="individual" />
          <Label htmlFor="individual" className="cursor-pointer">{t('auth.individual')}</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="business" id="business" />
          <Label htmlFor="business" className="cursor-pointer">{t('auth.business')}</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AccountTypeSelector;
