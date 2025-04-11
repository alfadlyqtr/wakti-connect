
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AccountTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="account-type">Account Type</Label>
      <RadioGroup 
        defaultValue="free" 
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-1 sm:grid-cols-3 gap-2"
      >
        <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="free" id="free" className="mr-2" />
          <Label htmlFor="free" className="cursor-pointer flex-1">Free</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="individual" id="individual" className="mr-2" />
          <Label htmlFor="individual" className="cursor-pointer flex-1">Individual</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="business" id="business" className="mr-2" />
          <Label htmlFor="business" className="cursor-pointer flex-1">Business</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AccountTypeSelector;
