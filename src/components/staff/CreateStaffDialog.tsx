import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PermissionLevel, StaffPermissions } from "@/services/permissions/accessControlService";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";

interface CreateStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

// Form schema for staff creation
const staffFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  position: z.string().min(1, "Position is required"),
  role: z.string().min(1, "Role is required"),
  isServiceProvider: z.boolean().default(false),
  password: z.string().min(6, "Password must be at least 6 characters"),
  permissions: z.object({
    service_permission: z.string(),
    booking_permission: z.string(),
    staff_permission: z.string(),
    analytics_permission: z.string()
  }).optional()
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

const CreateStaffDialog: React.FC<CreateStaffDialogProps> = ({
  open,
  onOpenChange,
  onCreated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "Staff Member",
      role: "staff",
      isServiceProvider: false,
      password: "",
      permissions: {
        service_permission: 'none',
        booking_permission: 'none',
        staff_permission: 'none',
        analytics_permission: 'none'
      }
    }
  });
  
  // Update permissions based on role
  const handleRoleChange = (newRole: string) => {
    form.setValue("role", newRole);
    
    if (newRole === 'co-admin') {
      form.setValue("permissions", {
        service_permission: 'admin',
        booking_permission: 'admin',
        staff_permission: 'admin',
        analytics_permission: 'admin'
      });
    } else if (newRole === 'admin') {
      form.setValue("permissions", {
        service_permission: 'admin',
        booking_permission: 'admin',
        staff_permission: 'write',
        analytics_permission: 'admin'
      });
    }
  };

  const onSubmit = async (data: StaffFormValues) => {
    setIsLoading(true);

    try {
      if (!user?.id) {
        throw new Error("Not authenticated");
      }
      
      const businessId = user.businessId || user.id;
    
      // Check if a co-admin already exists
      if (data.role === 'co-admin') {
        const { data: existingCoAdmin, error: coAdminError } = await supabase
          .from('business_staff')
          .select('id')
          .eq('business_id', businessId)
          .eq('role', 'co-admin')
          .eq('status', 'active')
          .maybeSingle();
        
        if (coAdminError) throw coAdminError;
        
        if (existingCoAdmin) {
          throw new Error("You already have a Co-Admin. Only one Co-Admin is allowed per business.");
        }
      }
      
      // Set default permissions based on role
      let staffPermissions: Record<string, any> = {};
      if (data.role === 'co-admin') {
        staffPermissions = {
          service_permission: 'admin',
          booking_permission: 'admin',
          staff_permission: 'admin',
          analytics_permission: 'admin'
        };
      } else if (data.role === 'admin') {
        staffPermissions = {
          service_permission: 'admin',
          booking_permission: 'admin',
          staff_permission: 'write',
          analytics_permission: 'admin'
        };
      } else {
        // Regular staff gets custom permissions
        staffPermissions = data.permissions || {
          service_permission: 'none',
          booking_permission: 'none',
          staff_permission: 'none',
          analytics_permission: 'none'
        };
      }
      
      // Generate a staff ID - in a real system this would be more sophisticated
      const staffId = crypto.randomUUID();
      
      // Create the staff member record
      const { data: staff, error } = await supabase
        .from('business_staff')
        .insert({
          business_id: businessId,
          name: data.name,
          email: data.email,
          position: data.position,
          role: data.role,
          is_service_provider: data.isServiceProvider,
          permissions: staffPermissions,
          staff_id: staffId,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Run populate access control
      await supabase.rpc('populate_access_control');

      toast({
        title: "Staff added",
        description: `${data.name} has been added to your team.`,
      });

      form.reset();
      onOpenChange(false);
      if (onCreated) onCreated();
    } catch (error: any) {
      console.error("Error creating staff:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Staff Member</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Staff member name" />
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
                    <Input {...field} type="password" placeholder="Enter password" />
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
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Sales Representative" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleRoleChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="co-admin">Co-Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.value === 'co-admin' && (
                    <p className="text-xs text-amber-500">
                      Note: Only one Co-Admin is allowed per business.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isServiceProvider"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Service Provider</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      This staff member can be assigned to provide services
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            {form.watch("role") === 'staff' && (
              <div className="space-y-4 border p-4 rounded-md">
                <h3 className="font-medium">Permissions</h3>
                
                <FormField
                  control={form.control}
                  name="permissions.service_permission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Services Permission</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permissions.booking_permission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bookings Permission</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permissions.staff_permission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Staff Management Permission</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permissions.analytics_permission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Analytics Permission</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    Creating...
                  </span>
                ) : (
                  'Create Staff Member'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStaffDialog;
