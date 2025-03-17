
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Service, ServiceFormValues } from "@/types/service.types";
import { useStaffData } from "@/hooks/useStaffData";

// Define service form schema
const serviceFormSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  price: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),
  staff_ids: z.array(z.string()).optional()
});

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
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: editingService?.name || "",
      description: editingService?.description || "",
      price: editingService?.price?.toString() || "",
      duration: editingService?.duration?.toString() || "60",
      staff_ids: []
    }
  });

  // Load assigned staff when editing
  useEffect(() => {
    if (editingService && editingService.assigned_staff) {
      const staffIds = editingService.assigned_staff.map(staff => staff.id);
      setSelectedStaff(staffIds);
      form.setValue('staff_ids', staffIds);
    }
  }, [editingService, form]);

  const handleStaffToggle = (staffId: string) => {
    const updatedStaff = selectedStaff.includes(staffId)
      ? selectedStaff.filter(id => id !== staffId)
      : [...selectedStaff, staffId];
    
    setSelectedStaff(updatedStaff);
    form.setValue('staff_ids', updatedStaff);
  };

  const handleSubmit = (values: ServiceFormValues) => {
    // Include the selected staff IDs
    values.staff_ids = selectedStaff;
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogHeader>
          <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {editingService 
              ? "Edit the details of your existing service." 
              : "Create a new service for your business."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="Service name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    className="min-h-[80px] flex w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Service description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (QAR)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (min)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Staff Assignment Section */}
          <div className="space-y-3">
            <FormLabel>Assign Staff</FormLabel>
            {isStaffLoading ? (
              <div className="text-sm text-muted-foreground">Loading staff members...</div>
            ) : staffData && staffData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {staffData.map((staff) => (
                  <div key={staff.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`staff-${staff.id}`} 
                      checked={selectedStaff.includes(staff.id)} 
                      onCheckedChange={() => handleStaffToggle(staff.id)}
                    />
                    <label 
                      htmlFor={`staff-${staff.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {staff.name} ({staff.role})
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No staff members found. Add staff in the Staff Management section.</div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : (editingService ? "Update Service" : "Add Service")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ServiceForm;
