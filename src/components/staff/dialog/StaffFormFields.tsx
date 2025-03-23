
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "./StaffFormSchema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffInfoFields from "./fields/StaffInfoFields";
import RoleIdentityFields from "./fields/RoleIdentityFields";
import PermissionGroups from "./fields/PermissionGroups";

interface StaffFormFieldsProps {
  form: UseFormReturn<StaffFormValues>;
  isEditing?: boolean;
}

const StaffFormFields: React.FC<StaffFormFieldsProps> = ({ form, isEditing = false }) => {
  return (
    <div className="space-y-6">
      <StaffInfoFields form={form} />
      <RoleIdentityFields form={form} />
      <PermissionGroups form={form} />
    </div>
  );
};

export default StaffFormFields;
