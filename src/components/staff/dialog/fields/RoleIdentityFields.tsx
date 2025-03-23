
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface RoleIdentityFieldsProps {
  form: UseFormReturn<StaffFormValues>;
}

const RoleIdentityFields: React.FC<RoleIdentityFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-base">Role & Privileges</h3>
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="isCoAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Co-Admin Access</FormLabel>
                <FormDescription>
                  Grant administrative privileges to this staff member
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isServiceProvider"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Service Provider</FormLabel>
                <FormDescription>
                  Enables this staff member to be assigned to services
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default RoleIdentityFields;
