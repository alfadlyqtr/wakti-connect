
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { EditStaffFormValues } from "../hooks/useStaffDetailsForm";
import PermissionGroups from "../../fields/PermissionGroups";

interface PermissionsTabProps {
  form: UseFormReturn<EditStaffFormValues>;
}

export const PermissionsTab: React.FC<PermissionsTabProps> = ({ form }) => {
  return (
    <PermissionGroups form={form} />
  );
};
