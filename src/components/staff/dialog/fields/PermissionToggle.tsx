
import React from "react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import { LucideIcon } from "lucide-react";

interface PermissionToggleProps {
  form: UseFormReturn<StaffFormValues>;
  name: `permissions.${string}`;
  label: string;
  description: string;
  icon: LucideIcon;
}

const PermissionToggle: React.FC<PermissionToggleProps> = ({
  form,
  name,
  label,
  description,
  icon: Icon
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
          <div className="space-y-0.5 flex items-start gap-3">
            <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <FormLabel className="text-base font-normal">{label}</FormLabel>
              <FormDescription>
                {description}
              </FormDescription>
            </div>
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
  );
};

export default PermissionToggle;
