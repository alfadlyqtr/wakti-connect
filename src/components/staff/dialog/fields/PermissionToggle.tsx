
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
import { cn } from "@/lib/utils";

interface PermissionToggleProps {
  form: UseFormReturn<StaffFormValues>;
  name: keyof StaffFormValues["permissions"] extends infer K ? `permissions.${K & string}` : never;
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
      render={({ field }) => {
        const isEnabled = !!field.value;
        
        return (
          <FormItem className={cn(
            "flex flex-row items-center justify-between p-4 rounded-lg border transition-colors",
            isEnabled ? "bg-emerald-50 border-emerald-200" : ""
          )}>
            <div className="space-y-0.5 flex items-start gap-3">
              <Icon className={cn(
                "h-5 w-5 mt-0.5",
                isEnabled ? "text-emerald-600" : "text-muted-foreground"
              )} />
              <div>
                <FormLabel className="text-base font-medium">{label}</FormLabel>
                <FormDescription>
                  {description}
                </FormDescription>
              </div>
            </div>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-emerald-500"
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default PermissionToggle;
