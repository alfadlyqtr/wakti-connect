
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateTab, InfoTab } from "./dialog";
import { useCreateStaff } from "@/hooks/staff/useCreateStaff";

interface CreateStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateStaffDialog: React.FC<CreateStaffDialogProps> = ({ open, onOpenChange }) => {
  const { 
    form, 
    onSubmit, 
    activeTab, 
    setActiveTab, 
    createInvitation 
  } = useCreateStaff();
  
  const handleSubmit = async (values: any) => {
    const success = await onSubmit(values);
    if (success) {
      onOpenChange(false);
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
              onSubmit={handleSubmit} 
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
