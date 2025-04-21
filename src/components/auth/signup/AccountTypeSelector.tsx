
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AccountTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AccountTypeSelector = ({ value, onChange }: AccountTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label>Choose account type</Label>
      <RadioGroup 
        value={value}
        onValueChange={onChange}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="individual" id="individual" />
          <Label htmlFor="individual" className="cursor-pointer">
            Individual
            <span className="text-xs text-muted-foreground block">For personal use with all standard features</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="business" id="business" />
          <Label htmlFor="business" className="cursor-pointer">
            Business
            <span className="text-xs text-muted-foreground block">For businesses with staff management features</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AccountTypeSelector;
