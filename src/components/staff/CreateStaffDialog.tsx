
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
import { Card } from "@/components/ui/card";

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
    isSubmitting 
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
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Staff Account</DialogTitle>
          <DialogDescription>
            Manually create a staff account for your business
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="create">Create Staff</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <Card className="border shadow-sm">
              <CreateTab 
                form={form} 
                onSubmit={handleSubmit} 
                onCancel={() => onOpenChange(false)}
                isSubmitting={isSubmitting}
              />
            </Card>
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
