
import React, { ReactNode } from "react";
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
  icon: ReactNode;
  rightIcon?: ReactNode;
  helpText?: string;
}

const FormInputField: React.FC<FormInputFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  minLength,
  icon,
  rightIcon,
  helpText,
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
          className={`pl-10 ${rightIcon ? "pr-10" : ""}`}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
        />
        {rightIcon && (
          <div className="absolute right-1 top-1">
            {rightIcon}
          </div>
        )}
      </div>
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
};

export default FormInputField;
