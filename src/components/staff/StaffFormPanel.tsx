
import React, { useEffect } from "react";
import { useCreateStaff } from "@/hooks/staff/useCreateStaff";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffFormSchema, StaffFormValues } from "@/components/auth/staff-signup/validation";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface StaffFormPanelProps {
  staffId: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const StaffFormPanel: React.FC<StaffFormPanelProps> = ({ staffId, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const isEditing = !!staffId;
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      position: "",
      isServiceProvider: false,
      isCoAdmin: false,
      permissions: {
        can_view_tasks: true,
        can_manage_tasks: false,
        can_message_staff: true,
        can_manage_bookings: false,
        can_create_job_cards: false,
        can_track_hours: true,
        can_log_earnings: false,
        can_edit_profile: true,
        can_view_customer_bookings: false,
        can_view_analytics: false
      }
    }
  });
  
  // Fetch staff data if editing
  const { data: staffData, isLoading } = useQuery({
    queryKey: ['staffMember', staffId],
    queryFn: async () => {
      if (!staffId) return null;
      
      const { data, error } = await supabase
        .from('business_staff')
        .select('*, profiles:staff_id(full_name, email)')
        .eq('id', staffId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: isEditing
  });
  
  // Check co-admin limit
  const { data: hasCoAdmin } = useQuery({
    queryKey: ['hasCoAdmin'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return true; // Default to true to disable the switch
      
      const { data, error } = await supabase
        .from('business_staff')
        .select('id')
        .eq('business_id', session.user.id)
        .eq('role', 'co-admin')
        .neq('id', staffId || 'none') // Exclude current staff if editing
        .eq('status', 'active');
        
      if (error) throw error;
      return data.length > 0;
    }
  });
  
  // Populate form when editing
  useEffect(() => {
    if (staffData) {
      const profileData = staffData.profiles as any || {};
      
      form.reset({
        fullName: profileData.full_name || staffData.name || "",
        email: profileData.email || staffData.email || "",
        password: "", // Don't populate password fields when editing
        confirmPassword: "",
        position: staffData.position || "",
        isServiceProvider: staffData.is_service_provider || false,
        isCoAdmin: staffData.role === 'co-admin',
        permissions: {
          can_view_tasks: staffData.permissions?.can_view_tasks ?? true,
          can_manage_tasks: staffData.permissions?.can_manage_tasks ?? false,
          can_message_staff: staffData.permissions?.can_message_staff ?? true,
          can_manage_bookings: staffData.permissions?.can_manage_bookings ?? false,
          can_create_job_cards: staffData.permissions?.can_create_job_cards ?? false,
          can_track_hours: staffData.permissions?.can_track_hours ?? true,
          can_log_earnings: staffData.permissions?.can_log_earnings ?? false,
          can_edit_profile: staffData.permissions?.can_edit_profile ?? true,
          can_view_customer_bookings: staffData.permissions?.can_view_customer_bookings ?? false,
          can_view_analytics: staffData.permissions?.can_view_analytics ?? false
        }
      });
    }
  }, [staffData, form]);
  
  const onSubmit = async (data: StaffFormValues) => {
    try {
      if (isEditing) {
        // Update staff account
        const { error } = await supabase
          .from('business_staff')
          .update({
            name: data.fullName,
            position: data.position,
            role: data.isCoAdmin ? 'co-admin' : 'staff',
            is_service_provider: data.isServiceProvider,
            permissions: data.permissions
          })
          .eq('id', staffId);
          
        if (error) throw error;
        
        toast({
          title: "Staff Updated",
          description: "The staff account has been updated successfully."
        });
      } else {
        // Create new staff account
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");
        
        // 1. Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true,
          user_metadata: {
            full_name: data.fullName
          }
        });
        
        if (authError) throw authError;
        if (!authData.user) throw new Error("Failed to create user account");
        
        // 2. Create staff record
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .insert({
            business_id: session.user.id,
            staff_id: authData.user.id,
            name: data.fullName,
            email: data.email,
            position: data.position || 'Staff Member',
            role: data.isCoAdmin ? 'co-admin' : 'staff',
            is_service_provider: data.isServiceProvider,
            permissions: data.permissions,
            status: 'active'
          })
          .select()
          .single();
          
        if (staffError) throw staffError;
        
        // 3. Create automatic contact relationship
        await supabase
          .from('user_contacts')
          .insert({
            user_id: session.user.id,
            contact_id: authData.user.id,
            status: 'accepted',
            staff_relation_id: staffData.id
          });
          
        toast({
          title: "Staff Created",
          description: "The staff account has been created successfully."
        });
      }
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading && isEditing) {
    return <div className="py-8 text-center">Loading staff data...</div>;
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {isEditing ? "Edit Staff Account" : "Create New Staff Account"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                  <FormLabel>Position/Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="staff@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <FormField
              control={form.control}
              name="isServiceProvider"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Service Provider</FormLabel>
                    <FormDescription>
                      Allow this staff to provide services to customers
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
              name="isCoAdmin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Co-Admin</FormLabel>
                    <FormDescription>
                      Make this user a Co-Admin of your business
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={hasCoAdmin && !field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Staff Permissions</h3>
          <p className="text-sm text-muted-foreground">
            Control what this staff member can access and do
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="permissions.can_view_tasks"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>View Tasks</FormLabel>
                    <FormDescription>
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Manage Tasks</FormLabel>
                    <FormDescription>
                      Can create, edit and delete tasks
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
              name="permissions.can_message_staff"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Message Staff</FormLabel>
                    <FormDescription>
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
              name="permissions.can_manage_bookings"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Manage Bookings</FormLabel>
                    <FormDescription>
                      Can manage customer bookings
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Create Job Cards</FormLabel>
                    <FormDescription>
                      Can create and close job cards
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
              name="permissions.can_track_hours"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Track Hours</FormLabel>
                    <FormDescription>
                      Can track working hours
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Log Earnings</FormLabel>
                    <FormDescription>
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
              name="permissions.can_edit_profile"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Edit Profile</FormLabel>
                    <FormDescription>
                      Can edit their own profile
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>View Customer Bookings</FormLabel>
                    <FormDescription>
                      Can view customer booking details
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>View Analytics</FormLabel>
                    <FormDescription>
                      Can view business analytics (read-only)
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
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Staff" : "Create Staff"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StaffFormPanel;
