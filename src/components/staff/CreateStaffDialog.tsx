
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useStaffInvitations } from "@/hooks/useStaffInvitations";

const staffFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal('')),
  role: z.string().min(1, "Please select a role"),
  position: z.string().optional(),
  sendInvitation: z.boolean().optional().default(false)
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

interface CreateStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateStaffDialog: React.FC<CreateStaffDialogProps> = ({ open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const { createInvitation } = useStaffInvitations();
  const [activeTab, setActiveTab] = React.useState("create");
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "staff",
      position: "",
      sendInvitation: true
    }
  });
  
  const onSubmit = async (values: StaffFormValues) => {
    try {
      // Get the current user's ID (the business ID)
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      if (values.sendInvitation && values.email) {
        // Send invitation to staff
        await createInvitation.mutateAsync({
          name: values.name,
          email: values.email,
          role: values.role,
          position: values.position
        });
      } else {
        // Create staff without invitation (legacy method)
        const { error } = await supabase
          .from('business_staff')
          .insert({
            business_id: session.session.user.id,
            name: values.name,
            email: values.email || null,
            role: values.role,
            position: values.position || 'staff',
            staff_id: session.session.user.id // Using business owner's ID as staff_id for now
          });
          
        if (error) throw error;
        
        toast({
          title: "Staff member created",
          description: "The staff member has been added successfully."
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['staffData'] });
      queryClient.invalidateQueries({ queryKey: ['businessStaff'] });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating staff:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create staff member",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) form.reset();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
          <DialogDescription>
            Create a new staff member for your business
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Staff</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="staff@example.com" {...field} />
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
                      <FormLabel>Role <span className="text-destructive">*</span></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="co-admin">Co-Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
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
                  name="sendInvitation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="send-invitation">
                          Send invitation email
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow this staff member to create their own account
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createInvitation.isPending}>
                    {createInvitation.isPending ? "Adding..." : "Add Staff Member"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="info">
            <div className="space-y-4 py-2">
              <div>
                <h3 className="text-sm font-medium">Staff Access Levels</h3>
                <ul className="mt-2 text-sm text-muted-foreground space-y-2">
                  <li>
                    <strong>Admin:</strong> Full access to all business features
                  </li>
                  <li>
                    <strong>Co-Admin:</strong> Can manage staff and view analytics (limited to one per business)
                  </li>
                  <li>
                    <strong>Staff:</strong> Standard access with job tracking capabilities
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Staff Invitations</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  When you send an invitation, staff members receive a link to create their own account.
                  This allows them to login separately from your account.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStaffDialog;
