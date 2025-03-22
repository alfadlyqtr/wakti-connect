
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
        <StaffFormFields form={form} />
        
        <DialogFooter className="mt-6">
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
