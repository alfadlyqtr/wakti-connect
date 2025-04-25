
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormInputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helpText?: string;
}

const FormInputField: React.FC<FormInputFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
  minLength,
  icon,
  rightIcon,
  helpText
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          className={`w-full ${icon ? 'pl-10' : ''}`}
        />
        {rightIcon}
      </div>
      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export default FormInputField;
