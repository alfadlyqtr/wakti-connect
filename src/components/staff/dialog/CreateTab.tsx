
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StaffFormFields from "./StaffFormFields";
import { StaffFormValues } from "./StaffFormSchema";

interface CreateTabProps {
  form: UseFormReturn<StaffFormValues>;
  onSubmit: (values: StaffFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CreateTab: React.FC<CreateTabProps> = ({ 
  form, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="sticky top-0 z-10 bg-background pt-2 pb-4 border-b mb-4">
          <h3 className="text-lg font-semibold">Create New Staff</h3>
          <p className="text-sm text-muted-foreground">Assign permissions and role below</p>
        </div>
        
        <StaffFormFields form={form} />
        
        <DialogFooter className="mt-6 pt-4 border-t sticky bottom-0 bg-background">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Staff Account"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateTab;
