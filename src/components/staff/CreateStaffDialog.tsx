
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
      <DialogContent className="sm:max-w-5xl p-0 max-h-[90vh] overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="px-6 pt-6 pb-2">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create Staff Account</DialogTitle>
              <DialogDescription>
                Create a staff account with custom permissions for your business
              </DialogDescription>
            </DialogHeader>
            
            <TabsList className="grid w-full grid-cols-2 mt-4">
              <TabsTrigger value="create">Create Staff</TabsTrigger>
              <TabsTrigger value="info">Information</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="create" className="flex-1 overflow-y-auto p-6 pt-0">
            <Card className="border-0 shadow-none">
              <CreateTab 
                form={form} 
                onSubmit={handleSubmit} 
                onCancel={() => onOpenChange(false)}
                isSubmitting={isSubmitting}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="info" className="flex-1 overflow-y-auto p-6">
            <InfoTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStaffDialog;
