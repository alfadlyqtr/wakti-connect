
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";

interface BusinessNameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const BusinessNameField: React.FC<BusinessNameFieldProps> = ({ value, onChange, required }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="business-name">Business Name</Label>
      <div className="relative">
        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="business-name"
          type="text"
          placeholder="Your Business Name"
          value={value}
          onChange={onChange}
          required={required}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default BusinessNameField;
