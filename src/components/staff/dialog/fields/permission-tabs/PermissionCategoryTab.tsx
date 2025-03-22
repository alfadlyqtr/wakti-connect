
import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../../StaffFormSchema";
import { FormField, FormItem, FormControl, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface PermissionCategoryTabProps {
  form: UseFormReturn<StaffFormValues>;
  category: string;
  icon?: LucideIcon;
  title?: string;
  isActive?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

// This is a mapping of category to permissions
const CATEGORY_PERMISSIONS = {
  tasks: [
    { name: "permissions.can_view_tasks", title: "View Tasks", description: "Can view assigned tasks" },
    { name: "permissions.can_manage_tasks", title: "Manage Tasks", description: "Can create, edit, and delete tasks" },
    { name: "permissions.can_track_hours", title: "Track Hours", description: "Can track working hours" },
    { name: "permissions.can_log_earnings", title: "Log Earnings", description: "Can log daily earnings" }
  ],
  communication: [
    { name: "permissions.can_message_staff", title: "Message Staff", description: "Can message other staff members" },
    { name: "permissions.can_manage_bookings", title: "Manage Bookings", description: "Can manage customer bookings" },
    { name: "permissions.can_view_customer_bookings", title: "View Customer Bookings", description: "Can view booking details" }
  ],
  business: [
    { name: "permissions.can_create_job_cards", title: "Create Job Cards", description: "Can create and close job cards" },
    { name: "permissions.can_view_analytics", title: "View Analytics", description: "Can view business analytics" },
    { name: "permissions.can_edit_profile", title: "Edit Profile", description: "Can edit their own profile" }
  ]
};

const PermissionCategoryTab: React.FC<PermissionCategoryTabProps> = ({
  form,
  category,
  icon: Icon,
  title,
  isActive,
  onClick,
  children,
}) => {
  // Get the permissions for this category
  const permissions = CATEGORY_PERMISSIONS[category as keyof typeof CATEGORY_PERMISSIONS] || [];
  
  return (
    <div className="space-y-4">
      {Icon && title && (
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors",
            isActive 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
          onClick={onClick}
        >
          <Icon className="h-4 w-4" />
          <span>{title}</span>
          {children}
        </div>
      )}
      
      <div className="space-y-3">
        {permissions.map((permission) => (
          <FormField
            key={permission.name}
            control={form.control}
            name={permission.name as any}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{permission.title}</FormLabel>
                  <FormDescription>{permission.description}</FormDescription>
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
        ))}
      </div>
    </div>
  );
};

export default PermissionCategoryTab;
