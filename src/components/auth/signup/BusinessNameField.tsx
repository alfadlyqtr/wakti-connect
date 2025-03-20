
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building } from "lucide-react";

interface BusinessNameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
}

const BusinessNameField: React.FC<BusinessNameFieldProps> = ({ value, onChange, required }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="business-name">Business Name <span className="text-destructive">*</span></Label>
      <div className="relative">
        <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input 
          id="business-name" 
          type="text" 
          placeholder="Your Business Name" 
          className="pl-10"
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
};

export default BusinessNameField;
