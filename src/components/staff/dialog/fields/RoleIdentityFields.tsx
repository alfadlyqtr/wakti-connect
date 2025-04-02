
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Shield, Users } from "lucide-react";

interface RoleIdentityFieldsProps {
  form: UseFormReturn<StaffFormValues>;
}

const RoleIdentityFields: React.FC<RoleIdentityFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Role & Identity</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="isCoAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Co-Admin</FormLabel>
                <FormDescription>
                  Can access all features and settings
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Service Provider</FormLabel>
                <FormDescription>
                  Can be assigned to bookings
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
          name="addToContacts"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-full">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  <FormLabel className="text-base">Add to Contacts</FormLabel>
                </div>
                <FormDescription>
                  Automatically add this staff member to your contacts list for messaging
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
