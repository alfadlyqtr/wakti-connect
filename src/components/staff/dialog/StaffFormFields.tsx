
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "./StaffFormSchema";
import { StaffInfoFields, RoleIdentityFields, PermissionGroups } from "./fields";

interface StaffFormFieldsProps {
  form: UseFormReturn<StaffFormValues>;
}

const StaffFormFields: React.FC<StaffFormFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-8">
      <StaffInfoFields form={form} />
      <RoleIdentityFields form={form} />
      <PermissionGroups form={form} />
    </div>
  );
};

export default StaffFormFields;
