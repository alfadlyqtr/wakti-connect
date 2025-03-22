
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { StaffFormValues } from "./StaffFormSchema";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StaffFormFieldsProps {
  form: UseFormReturn<StaffFormValues>;
}

const StaffFormFields: React.FC<StaffFormFieldsProps> = ({ form }) => {
  // Generate staff number based on business name
  const { data: businessData } = useQuery({
    queryKey: ['businessProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('business_name')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      return data;
    }
  });
  
  // Get staff count for numbering
  const { data: staffCount } = useQuery({
    queryKey: ['staffCount'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const { count, error } = await supabase
        .from('business_staff')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.user.id);
        
      if (error) throw error;
      return count || 0;
    }
  });
  
  // Generate staff number
  const staffNumber = React.useMemo(() => {
    if (!businessData?.business_name) return 'STAFF_001';
    
    const prefix = businessData.business_name
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
      
    return `${prefix}_${String(staffCount || 0).padStart(3, '0')}`;
  }, [businessData, staffCount]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Column 1: Basic Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium mb-2">Basic Information</h4>
        
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter staff name" {...field} />
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
              <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input type="email" placeholder="staff@example.com" {...field} />
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
              <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input type="password" placeholder="Minimum 8 characters" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Column 2: Additional Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium mb-2">Additional Information</h4>
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm password" {...field} />
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
                <Input placeholder="e.g. Manager, Receptionist" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-1">
          <FormLabel className="text-sm">Staff Number</FormLabel>
          <div className="flex items-center mt-2">
            <Input value={staffNumber} readOnly className="bg-muted" />
            <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 border">Auto-generated</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Unique identifier for this staff member
          </p>
        </div>
        
        <div className="flex flex-col space-y-4 mt-4">
          <FormField
            control={form.control}
            name="isCoAdmin"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Co-Admin</FormLabel>
                  <FormDescription className="text-xs">
                    Make this staff a co-admin (limit 1)
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
            name="isServiceProvider"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Service Provider</FormLabel>
                  <FormDescription className="text-xs">
                    Can provide services to customers
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
      
      {/* Column 3: Permissions */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium mb-2">Staff Permissions</h4>
        
        <div className="divide-y rounded-md border overflow-hidden">
          <FormField
            control={form.control}
            name="permissions.can_view_tasks"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 bg-background">
                <FormLabel className="text-sm font-normal">View Tasks</FormLabel>
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
              <FormItem className="flex flex-row items-center justify-between p-3 bg-background">
                <FormLabel className="text-sm font-normal">Manage Tasks</FormLabel>
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
              <FormItem className="flex flex-row items-center justify-between p-3 bg-background">
                <FormLabel className="text-sm font-normal">Message Staff</FormLabel>
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
              <FormItem className="flex flex-row items-center justify-between p-3 bg-background">
                <FormLabel className="text-sm font-normal">Manage Bookings</FormLabel>
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
              <FormItem className="flex flex-row items-center justify-between p-3 bg-background">
                <FormLabel className="text-sm font-normal">Create Job Cards</FormLabel>
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
              <FormItem className="flex flex-row items-center justify-between p-3 bg-background">
                <FormLabel className="text-sm font-normal">Track Hours</FormLabel>
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
              <FormItem className="flex flex-row items-center justify-between p-3 bg-background">
                <FormLabel className="text-sm font-normal">Log Earnings</FormLabel>
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
              <FormItem className="flex flex-row items-center justify-between p-3 bg-background">
                <FormLabel className="text-sm font-normal">View Analytics</FormLabel>
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
    </div>
  );
};

export default StaffFormFields;
