
import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface IndividualProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  readOnly?: boolean;
}

const IndividualProfileFields: React.FC<IndividualProfileFieldsProps> = ({ 
  register, 
  errors,
  readOnly = false
}) => {
  return (
    <div className="grid grid-cols-1 gap-5">
      {/* Individual user fields could be added here if needed */}
    </div>
  );
};

export default IndividualProfileFields;
