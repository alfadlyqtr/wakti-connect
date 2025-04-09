
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AccountTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="account-type">Account Type</Label>
      <RadioGroup 
        defaultValue="free" 
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-2 pt-2"
      >
        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="free" id="free" />
          <Label htmlFor="free" className="cursor-pointer">Free</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="individual" id="individual" />
          <Label htmlFor="individual" className="cursor-pointer">Individual</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="business" id="business" />
          <Label htmlFor="business" className="cursor-pointer">Business</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AccountTypeSelector;
