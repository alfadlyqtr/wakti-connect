
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useStaffInvitations } from "@/hooks/useStaffInvitations";
import { CreateTab, InfoTab, staffFormSchema } from "./dialog";
import type { StaffFormValues } from "./dialog";

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
            <CreateTab 
              form={form} 
              onSubmit={onSubmit} 
              onCancel={() => onOpenChange(false)}
              createInvitation={createInvitation}
            />
          </TabsContent>
          
          <TabsContent value="info">
            <InfoTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStaffDialog;
