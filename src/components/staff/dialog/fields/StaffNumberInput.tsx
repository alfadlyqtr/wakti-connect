
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

interface StaffNumberInputProps {
  form: UseFormReturn<StaffFormValues>;
}

const StaffNumberInput: React.FC<StaffNumberInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="position" // Using position field instead since staffNumber was removed
      render={({ field }) => (
        <FormItem>
          <FormLabel>Position ID <span className="text-muted-foreground">(Optional)</span></FormLabel>
          <FormControl>
            <Input {...field} placeholder="Position identifier" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StaffNumberInput;
