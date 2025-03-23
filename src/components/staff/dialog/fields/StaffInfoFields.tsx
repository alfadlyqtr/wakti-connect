
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AvatarUpload from "./AvatarUpload";
import StaffNumberInput from "./StaffNumberInput";

interface StaffInfoFieldsProps {
  form: UseFormReturn<StaffFormValues>;
}

const StaffInfoFields: React.FC<StaffInfoFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-base">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <AvatarUpload form={form} />
        </div>
        
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="staff@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="••••••••" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="••••••••" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position <span className="text-muted-foreground">(Optional)</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="E.g. Sales Manager" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <StaffNumberInput form={form} />
      </div>
    </div>
  );
};

export default StaffInfoFields;
