
import React, { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon: ReactNode;
  showPasswordToggle?: ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  icon,
  showPasswordToggle,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <div className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground">
          {icon}
        </div>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`pl-10 ${showPasswordToggle ? "pr-10" : ""}`}
          value={value}
          onChange={onChange}
          required={required}
        />
        {showPasswordToggle}
      </div>
    </div>
  );
};

export default FormField;
