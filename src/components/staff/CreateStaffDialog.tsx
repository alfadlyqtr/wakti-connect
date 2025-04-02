
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import StaffFormFields from "./dialog/StaffFormFields";
import { useCreateStaff } from "@/hooks/staff";

interface CreateStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateStaffDialog: React.FC<CreateStaffDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { form, onSubmit, isSubmitting } = useCreateStaff();

  const handleSubmit = async (values: any) => {
    const success = await onSubmit(values);
    if (success) {
      onOpenChange(false);
      form.reset();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <div className="sticky top-0 z-10 bg-background pt-6 px-6 pb-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Create New Staff</h3>
              <p className="text-sm text-muted-foreground">Set up account details and permissions</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <StaffFormFields form={form} />
            </form>
          </Form>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="mr-2"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            disabled={isSubmitting}
            onClick={form.handleSubmit(handleSubmit)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Staff Account"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateStaffDialog;
