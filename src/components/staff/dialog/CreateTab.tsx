
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StaffFormFields from "./StaffFormFields";
import { StaffFormValues } from "./StaffFormSchema";
import { UseMutationResult } from "@tanstack/react-query";
import { StaffInvitation, CreateInvitationData } from "@/hooks/staff/types";

interface CreateTabProps {
  form: UseFormReturn<StaffFormValues>;
  onSubmit: (values: StaffFormValues) => void;
  onCancel: () => void;
  createInvitation: UseMutationResult<StaffInvitation, Error, CreateInvitationData>;
}

const CreateTab: React.FC<CreateTabProps> = ({ 
  form, 
  onSubmit, 
  onCancel,
  createInvitation
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
          <Button type="submit" disabled={createInvitation.isPending}>
            {createInvitation.isPending ? "Adding..." : "Add Staff Member"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateTab;
