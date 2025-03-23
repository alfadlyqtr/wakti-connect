
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

interface PermissionGroupsProps {
  form: UseFormReturn<StaffFormValues>;
}

const PermissionGroups: React.FC<PermissionGroupsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-base">Permissions</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <h4 className="text-sm font-medium">Tasks</h4>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="permissions.can_view_tasks"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>View Tasks</FormLabel>
                      <FormDescription className="text-xs">
                        Can view assigned tasks
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
                name="permissions.can_manage_tasks"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Manage Tasks</FormLabel>
                      <FormDescription className="text-xs">
                        Can create and assign tasks
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
                name="permissions.can_update_task_status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Update Task Status</FormLabel>
                      <FormDescription className="text-xs">
                        Can update status of tasks
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
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <h4 className="text-sm font-medium">Bookings & Services</h4>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="permissions.can_manage_bookings"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Manage Bookings</FormLabel>
                      <FormDescription className="text-xs">
                        Can create and manage bookings
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
                name="permissions.can_update_booking_status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Update Booking Status</FormLabel>
                      <FormDescription className="text-xs">
                        Can update status of bookings
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
                name="permissions.can_create_job_cards"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Create Job Cards</FormLabel>
                      <FormDescription className="text-xs">
                        Can create and manage job cards
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
                name="permissions.can_view_customer_bookings"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>View Customer Bookings</FormLabel>
                      <FormDescription className="text-xs">
                        Can see all customer bookings
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
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <h4 className="text-sm font-medium">Communication & Profile</h4>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="permissions.can_message_staff"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Message Staff</FormLabel>
                      <FormDescription className="text-xs">
                        Can message other staff members
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
                name="permissions.can_edit_profile"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Edit Profile</FormLabel>
                      <FormDescription className="text-xs">
                        Can edit their own profile info
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
                name="permissions.can_update_profile"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Update Profile</FormLabel>
                      <FormDescription className="text-xs">
                        Can update their profile photo and details
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
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <h4 className="text-sm font-medium">Reports & Hours</h4>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="permissions.can_track_hours"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Track Hours</FormLabel>
                      <FormDescription className="text-xs">
                        Can log working hours
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
                name="permissions.can_log_earnings"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Log Earnings</FormLabel>
                      <FormDescription className="text-xs">
                        Can log daily earnings
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
                name="permissions.can_view_analytics"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>View Analytics</FormLabel>
                      <FormDescription className="text-xs">
                        Can view business analytics
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionGroups;
