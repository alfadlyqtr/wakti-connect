
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { EditStaffFormValues } from "../../hooks/useStaffDetailsForm";

interface RoleSectionProps {
  form: UseFormReturn<EditStaffFormValues>;
}

export const RoleSection: React.FC<RoleSectionProps> = ({ form }) => {
  return (
    <div className="flex flex-col space-y-2">
      <FormField
        control={form.control}
        name="isServiceProvider"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border space-y-0">
            <div className="space-y-0.5">
              <FormLabel>Service Provider</FormLabel>
              <FormDescription className="text-xs text-muted-foreground">
                Can be assigned to services and bookings
              </FormDescription>
            </div>
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="h-4 w-4"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="isCoAdmin"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border space-y-0">
            <div className="space-y-0.5">
              <FormLabel>Co-Admin</FormLabel>
              <FormDescription className="text-xs text-muted-foreground">
                Has higher permissions to manage the business
              </FormDescription>
            </div>
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="h-4 w-4"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
