
import React from "react";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BusinessNameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
}

const BusinessNameField: React.FC<BusinessNameFieldProps> = ({
  value,
  onChange,
  required,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="business-name">Business Name</Label>
      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="business-name"
          type="text"
          placeholder="Your Business"
          value={value}
          onChange={onChange}
          required={required}
          className="pl-10 w-full"
        />
      </div>
    </div>
  );
};

export default BusinessNameField;
