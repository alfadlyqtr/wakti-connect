
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import { 
  FormField, 
  FormItem,
  FormControl, 
  FormDescription 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { LucideIcon } from "lucide-react";

interface PermissionToggleProps {
  form: UseFormReturn<StaffFormValues>;
  name: string;
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
      name={name as any}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border space-y-0 hover:bg-muted/50 transition-colors">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-primary/10 p-1.5">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{label}</p>
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            </div>
          </div>
          <FormControl>
            <Switch 
              checked={field.value} 
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-primary"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default PermissionToggle;
