
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Service, ServiceFormValues } from "@/types/service.types";
import ServiceFormFields from "./ServiceFormFields";
import { useIsMobile } from "@/hooks/use-mobile";

// Define service form schema without requiring staff assignments
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
    })
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
  const isMobile = useIsMobile();
  
  // Setup form
  const form = useForm<ServiceFormSchemaType>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: editingService?.name || "",
      description: editingService?.description || "",
      price: editingService?.price?.toString() || "",
      duration: editingService?.duration?.toString() || "60",
    },
    mode: "onChange"
  });

  const handleSubmit = (values: ServiceFormSchemaType) => {
    const formValues: ServiceFormValues = {
      name: values.name,
      description: values.description || "",
      price: values.price || "",
      duration: values.duration
    };
    onSubmit(formValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DialogHeader className={isMobile ? "text-center space-y-2" : ""}>
          <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {editingService 
              ? "Edit the details of your existing service." 
              : "Create a new service for your business. You can assign staff members to this service later."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-2">
          <ServiceFormFields control={form.control} />
        </div>
        
        <DialogFooter className={isMobile ? "flex-col gap-2 mt-6" : "mt-6"}>
          <Button type="button" variant="outline" onClick={onCancel} className={isMobile ? "w-full" : ""}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isPending || !form.formState.isValid}
            className={isMobile ? "w-full" : ""}
          >
            {isPending ? "Saving..." : (editingService ? "Update Service" : "Add Service")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ServiceForm;
