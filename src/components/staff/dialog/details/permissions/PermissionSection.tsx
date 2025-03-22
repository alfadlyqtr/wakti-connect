
import React from "react";
import { FormField, FormItem, FormControl, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { EditStaffFormValues } from "../hooks/useStaffDetailsForm";

interface PermissionSectionProps {
  form: UseFormReturn<EditStaffFormValues>;
  title: string;
  description: string;
  name: `permissions.${string}`;
}

const PermissionSection: React.FC<PermissionSectionProps> = ({
  form,
  title,
  description,
  name,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{title}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default PermissionSection;
