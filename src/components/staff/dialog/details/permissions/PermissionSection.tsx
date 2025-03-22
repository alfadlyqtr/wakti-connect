
import React from "react";
import { FormField, FormItem, FormControl, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { EditStaffFormValues } from "../hooks/useStaffDetailsForm";

interface PermissionSectionProps {
  form: UseFormReturn<EditStaffFormValues>;
  title: string;
  description: string;
  name: keyof EditStaffFormValues | 
        "permissions.can_view_tasks" | 
        "permissions.can_manage_tasks" | 
        "permissions.can_message_staff" | 
        "permissions.can_manage_bookings" | 
        "permissions.can_create_job_cards" | 
        "permissions.can_track_hours" | 
        "permissions.can_log_earnings" | 
        "permissions.can_edit_profile" | 
        "permissions.can_view_customer_bookings" | 
        "permissions.can_view_analytics";
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
      name={name as any} // Type casting here resolves the TypeScript error
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
