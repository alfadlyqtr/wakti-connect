
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Shield, UserCog, Loader2 } from "lucide-react";
import { staffFormSchema, StaffFormValues, roleTemplates } from "./schema";

interface StaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffId: string | null;
  onSuccess?: () => void;
}

export function StaffDialog({ 
  open, 
  onOpenChange, 
  staffId, 
  onSuccess 
}: StaffDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!staffId;

  // Form setup
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      position: "",
      role: "staff",
      isServiceProvider: false,
      permissions: roleTemplates.basic
    }
  });

  // Fetch staff details when editing
  const { isLoading: isLoadingStaff } = useQuery({
    queryKey: ['staff', staffId],
    queryFn: async () => {
      if (!staffId) return null;
      
      const { data, error } = await supabase
        .from('business_staff')
        .select(`
          *,
          profiles:staff_id (
            avatar_url,
            full_name,
            email
          )
        `)
        .eq('id', staffId)
        .single();
        
      if (error) throw error;
      
      // Populate form with staff data
      form.reset({
        fullName: data.profiles?.full_name || data.name || "",
        email: data.profiles?.email || data.email || "",
        password: "",
        confirmPassword: "",
        position: data.position || "",
        role: data.role as "staff" | "co-admin",
        isServiceProvider: data.is_service_provider || false,
        permissions: data.permissions || roleTemplates.basic
      });
      
      return data;
    },
    enabled: open && isEditing,
    refetchOnWindowFocus: false
  });

  // Create/update staff mutation
  const { mutate: saveStaff, isPending: isSaving } = useMutation({
    mutationFn: async (values: StaffFormValues) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");
        
        if (isEditing) {
          // Update existing staff
          const { error } = await supabase
            .from('business_staff')
            .update({
              name: values.fullName,
              position: values.position,
              role: values.role,
              is_service_provider: values.isServiceProvider,
              permissions: values.permissions,
              updated_at: new Date().toISOString()
            })
            .eq('id', staffId);
            
          if (error) throw error;
          
          return { success: true };
        } else {
          // Create new staff
          // 1. Create auth user
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: values.email,
            password: values.password,
            email_confirm: true,
            user_metadata: {
              full_name: values.fullName,
              account_type: 'staff',
              business_id: session.user.id
            }
          });
          
          if (authError) throw authError;
          if (!authData?.user) throw new Error("Failed to create user account");
          
          // 2. Create staff record
          const { data: staffData, error: staffError } = await supabase
            .from('business_staff')
            .insert({
              business_id: session.user.id,
              staff_id: authData.user.id,
              name: values.fullName,
              email: values.email,
              position: values.position,
              role: values.role,
              is_service_provider: values.isServiceProvider,
              permissions: values.permissions,
              status: 'active'
            })
            .select()
            .single();
            
          if (staffError) throw staffError;
          
          // 3. Create contact relationship
          await supabase
            .from('user_contacts')
            .insert([
              {
                user_id: session.user.id,
                contact_id: authData.user.id,
                status: 'accepted',
                staff_relation_id: staffData.id
              },
              {
                user_id: authData.user.id,
                contact_id: session.user.id,
                status: 'accepted',
                staff_relation_id: staffData.id
              }
            ]);
            
          return { success: true, staffId: staffData.id };
        }
      } catch (error: any) {
        console.error("Error saving staff:", error);
        throw new Error(error.message || "Failed to save staff");
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Staff Updated" : "Staff Created",
        description: isEditing 
          ? "Staff member has been updated successfully" 
          : "Staff member has been created successfully"
      });
      
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save staff member",
        variant: "destructive"
      });
    }
  });

  // Check if a co-admin already exists
  const { data: hasCoAdmin } = useQuery({
    queryKey: ['hasCoAdmin'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return true; // Default to true to disable the option
      
      const { data, error } = await supabase
        .from('business_staff')
        .select('id')
        .eq('business_id', session.user.id)
        .eq('role', 'co-admin')
        .neq('id', staffId || '')
        .eq('status', 'active');
        
      if (error) throw error;
      return data.length > 0;
    },
    enabled: open
  });

  const onSubmit = (values: StaffFormValues) => {
    saveStaff(values);
  };

  const applyRoleTemplate = (template: 'basic' | 'manager' | 'receptionist') => {
    form.setValue('permissions', roleTemplates[template]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <UserCog className="h-5 w-5" />
                Edit Staff Member
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Add New Staff Member
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update staff details and permissions" 
              : "Create a new staff account for your business"}
          </DialogDescription>
        </DialogHeader>
        
        {isLoadingStaff && isEditing ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="permissions">
                    Permissions
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
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
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {!isEditing && (
                      <>
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
                        
                        <div></div>
                        
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
                      </>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            disabled={field.value === "co-admin" && hasCoAdmin}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem 
                                value="co-admin" 
                                disabled={hasCoAdmin}
                              >
                                Co-Admin {hasCoAdmin && "(Limit: 1)"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
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
                            <p className="text-sm text-muted-foreground">
                              Can provide services to customers
                            </p>
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
                </TabsContent>
                
                <TabsContent value="permissions" className="space-y-6 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-lg font-medium">Staff Permissions</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyRoleTemplate('basic')}
                    >
                      Basic Template
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyRoleTemplate('manager')}
                    >
                      Manager Template
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyRoleTemplate('receptionist')}
                    >
                      Receptionist Template
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="permissions.can_manage_tasks"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Manage Tasks</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Create, assign and manage tasks
                            </p>
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
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Manage Bookings</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Handle customer bookings and appointments
                            </p>
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
                        <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Track Hours</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Track working hours
                            </p>
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
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Log Earnings</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Record daily earnings and payments
                            </p>
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
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">View Analytics</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Access business reports and analytics
                            </p>
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
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    isEditing ? "Update Staff" : "Create Staff"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
