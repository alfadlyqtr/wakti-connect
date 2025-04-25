
import React from "react";
import FormInputField from "./FormInputField";
import { Building2 } from "lucide-react";

interface BusinessNameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const BusinessNameField: React.FC<BusinessNameFieldProps> = ({ value, onChange, required }) => {
  return (
    <FormInputField
      id="business-name"
      label="Business Name"
      type="text"
      placeholder="Your Business Name"
      value={value}
      onChange={onChange}
      required={required}
      icon={<Building2 className="h-4 w-4" />}
    />
  );
};

export default BusinessNameField;
