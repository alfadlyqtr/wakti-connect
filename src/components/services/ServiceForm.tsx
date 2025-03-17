
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Service, ServiceFormValues } from "@/types/service.types";
import { useStaffData } from "@/hooks/useStaffData";
import ServiceFormFields from "./ServiceFormFields";
import StaffAssignmentSection from "./StaffAssignmentSection";

// Define service form schema with better validation
const serviceFormSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.string()
    .refine(val => !val || !isNaN(Number(val)), {
      message: "Price must be a valid number"
    })
    .optional(),
  duration: z.string()
    .min(1, "Duration is required")
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Duration must be a positive number"
    }),
  staff_ids: z.array(z.string()).optional()
});

type ServiceFormSchemaType = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  onSubmit: (values: ServiceFormValues) => void;
  onCancel: () => void;
  editingService: Service | null;
  isPending: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ 
  onSubmit, 
  onCancel, 
  editingService, 
  isPending 
}) => {
  const { data: staffData, isLoading: isStaffLoading } = useStaffData();
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  // Setup form
  const form = useForm<ServiceFormSchemaType>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: editingService?.name || "",
      description: editingService?.description || "",
      price: editingService?.price?.toString() || "",
      duration: editingService?.duration?.toString() || "60",
      staff_ids: []
    },
    mode: "onChange" // Enable real-time validation
  });

  // Load assigned staff when editing
  useEffect(() => {
    if (editingService && editingService.assigned_staff) {
      const staffIds = editingService.assigned_staff.map(staff => staff.id);
      setSelectedStaff(staffIds);
      form.setValue('staff_ids', staffIds);
    }
  }, [editingService, form]);

  const handleStaffChange = (staffIds: string[]) => {
    setSelectedStaff(staffIds);
    form.setValue('staff_ids', staffIds);
  };

  const handleSubmit = (values: ServiceFormSchemaType) => {
    // Include the selected staff IDs and convert to ServiceFormValues
    const formValues: ServiceFormValues = {
      name: values.name,
      description: values.description || "",
      price: values.price || "",
      duration: values.duration,
      staff_ids: selectedStaff
    };
    onSubmit(formValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {editingService 
              ? "Edit the details of your existing service." 
              : "Create a new service for your business."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <ServiceFormFields control={form.control} />
          
          {/* Staff Assignment Section */}
          <StaffAssignmentSection 
            selectedStaff={selectedStaff}
            onStaffChange={handleStaffChange}
            staffData={staffData}
            isStaffLoading={isStaffLoading}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? "Saving..." : (editingService ? "Update Service" : "Add Service")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ServiceForm;
