
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
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  List, 
  CalendarCheck, 
  MessageSquare, 
  Clock, 
  CreditCard, 
  BarChart4, 
  Briefcase,
  DollarSign,
  ShieldCheck
} from "lucide-react";

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
    <div className="space-y-8">
      {/* Staff Information Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <h4 className="text-lg font-medium">Staff Information</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>
      
      <Separator />
      
      {/* Role & Identity Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          <h4 className="text-lg font-medium">Role & Identity</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel className="text-sm">Staff Number</FormLabel>
            <div className="flex items-center mt-2">
              <Input value={staffNumber} readOnly className="bg-muted" />
              <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 border">Auto-generated</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique identifier for this staff member
            </p>
          </div>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="isCoAdmin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Co-Admin</FormLabel>
                    <FormDescription>
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
                <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Service Provider</FormLabel>
                    <FormDescription>
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
      </div>
      
      <Separator />
      
      {/* Permissions Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <List className="h-5 w-5 text-muted-foreground" />
          <h4 className="text-lg font-medium">Staff Permissions</h4>
        </div>
        
        {/* Tasks Permissions */}
        <div className="space-y-3">
          <h5 className="text-sm font-medium text-muted-foreground">Tasks</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="permissions.can_view_tasks"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5 flex items-start gap-3">
                    <List className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <FormLabel className="text-base font-normal">View Tasks</FormLabel>
                      <FormDescription>
                        Can view assigned tasks
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
            
            <FormField
              control={form.control}
              name="permissions.can_manage_tasks"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5 flex items-start gap-3">
                    <List className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <FormLabel className="text-base font-normal">Manage Tasks</FormLabel>
                      <FormDescription>
                        Can create, edit, and delete tasks
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
          </div>
        </div>
        
        {/* Communication & Bookings */}
        <div className="space-y-3">
          <h5 className="text-sm font-medium text-muted-foreground">Communication & Bookings</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="permissions.can_message_staff"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5 flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <FormLabel className="text-base font-normal">Message Staff</FormLabel>
                      <FormDescription>
                        Can message other staff members
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
            
            <FormField
              control={form.control}
              name="permissions.can_manage_bookings"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5 flex items-start gap-3">
                    <CalendarCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <FormLabel className="text-base font-normal">Manage Bookings</FormLabel>
                      <FormDescription>
                        Can manage customer bookings
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
          </div>
        </div>
        
        {/* Work & Hours */}
        <div className="space-y-3">
          <h5 className="text-sm font-medium text-muted-foreground">Work & Earnings</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="permissions.can_track_hours"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5 flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <FormLabel className="text-base font-normal">Track Hours</FormLabel>
                      <FormDescription>
                        Can track working hours
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
            
            <FormField
              control={form.control}
              name="permissions.can_log_earnings"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5 flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <FormLabel className="text-base font-normal">Log Earnings</FormLabel>
                      <FormDescription>
                        Can log daily earnings
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
          </div>
        </div>
        
        {/* Job Cards & Analytics */}
        <div className="space-y-3">
          <h5 className="text-sm font-medium text-muted-foreground">Job Cards & Analytics</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="permissions.can_create_job_cards"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5 flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <FormLabel className="text-base font-normal">Create Job Cards</FormLabel>
                      <FormDescription>
                        Can create and close job cards
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
            
            <FormField
              control={form.control}
              name="permissions.can_view_analytics"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5 flex items-start gap-3">
                    <BarChart4 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <FormLabel className="text-base font-normal">View Analytics</FormLabel>
                      <FormDescription>
                        Can view business analytics
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffFormFields;
