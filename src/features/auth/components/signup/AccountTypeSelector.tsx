
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AccountTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label>Account Type</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="individual" id="individual" />
          <Label htmlFor="individual">Individual</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="business" id="business" />
          <Label htmlFor="business">Business</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AccountTypeSelector;
