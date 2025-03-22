
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../../StaffFormSchema";
import { FormField, FormItem, FormControl, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { LucideIcon } from "lucide-react";

export interface PermissionCategoryTabProps {
  form: UseFormReturn<StaffFormValues>;
  category: string;
  icon: LucideIcon;
  title: string;
}

const PermissionCategoryTab: React.FC<PermissionCategoryTabProps> = ({ 
  form,
  category,
  icon: Icon,
  title 
}) => {
  // Define permissions based on category
  const getPermissionsForCategory = (): { name: string; title: string; description: string; }[] => {
    switch (category) {
      case 'tasks':
        return [
          {
            name: 'can_view_tasks',
            title: 'View Tasks',
            description: 'Can view assigned tasks'
          },
          {
            name: 'can_manage_tasks',
            title: 'Manage Tasks',
            description: 'Can create, edit, and delete tasks'
          },
          {
            name: 'can_track_hours',
            title: 'Track Hours',
            description: 'Can track working hours'
          },
          {
            name: 'can_log_earnings',
            title: 'Log Earnings',
            description: 'Can log daily earnings'
          }
        ];
      case 'communication':
        return [
          {
            name: 'can_message_staff',
            title: 'Message Staff',
            description: 'Can message other staff members'
          },
          {
            name: 'can_manage_bookings',
            title: 'Manage Bookings',
            description: 'Can manage customer bookings'
          },
          {
            name: 'can_view_customer_bookings',
            title: 'View Customer Bookings',
            description: 'Can view customer booking details'
          }
        ];
      case 'business':
        return [
          {
            name: 'can_create_job_cards',
            title: 'Create Job Cards',
            description: 'Can create and close job cards'
          },
          {
            name: 'can_view_analytics',
            title: 'View Analytics',
            description: 'Can view business analytics'
          },
          {
            name: 'can_edit_profile',
            title: 'Edit Profile',
            description: 'Can edit their own profile'
          }
        ];
      default:
        return [];
    }
  };

  const permissions = getPermissionsForCategory();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {permissions.map((permission) => (
          <FormField
            key={permission.name}
            control={form.control}
            name={`permissions.${permission.name}` as any}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>{permission.title}</FormLabel>
                  <FormDescription>{permission.description}</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value || false}
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
