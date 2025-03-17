
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Service, ServiceFormValues } from "@/types/service.types";
import { useStaffData } from "@/hooks/useStaffData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [staffSearchQuery, setStaffSearchQuery] = useState("");

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

  const handleStaffToggle = (staffId: string) => {
    const updatedStaff = selectedStaff.includes(staffId)
      ? selectedStaff.filter(id => id !== staffId)
      : [...selectedStaff, staffId];
    
    setSelectedStaff(updatedStaff);
    form.setValue('staff_ids', updatedStaff);
  };

  // Filter staff by search query
  const filteredStaff = staffData?.filter(staff => 
    staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase())
  ) || [];

  // Get staff member by ID
  const getStaffMemberById = (id: string) => {
    return staffData?.find(staff => staff.id === id);
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter service name" {...field} />
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
                    className="min-h-[80px] flex w-full rounded-md border border-input bg-background px-3 py-2 resize-y"
                    placeholder="Describe your service..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (QAR)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">QAR</span>
                      <Input 
                        type="text" 
                        inputMode="decimal"
                        className="pl-12" 
                        placeholder="0.00" 
                        {...field}
                      />
                    </div>
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
                  <FormLabel>Duration (min) <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="60" 
                        min="1"
                        {...field} 
                      />
                      <span className="absolute right-3 top-2.5 text-muted-foreground">min</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Staff Assignment Section with improved UX */}
          <div className="space-y-3 border p-4 rounded-md">
            <FormLabel className="text-base">Assign Staff</FormLabel>
            
            {/* Selected Staff Badges */}
            {selectedStaff.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedStaff.map(staffId => {
                  const staff = getStaffMemberById(staffId);
                  return (
                    <Badge key={staffId} variant="secondary" className="flex items-center gap-1">
                      {staff?.name || "Unknown"}
                      <XCircle 
                        className="h-3.5 w-3.5 cursor-pointer ml-1" 
                        onClick={() => handleStaffToggle(staffId)}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
            
            {/* Staff Search */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff members..."
                className="pl-9"
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
              />
            </div>
            
            {isStaffLoading ? (
              <div className="text-sm text-muted-foreground p-2">Loading staff members...</div>
            ) : staffData && staffData.length > 0 ? (
              <ScrollArea className="h-48 border rounded-md">
                <div className="p-2">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <div 
                        key={staff.id} 
                        className={`flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted ${
                          selectedStaff.includes(staff.id) ? 'bg-muted' : ''
                        }`}
                        onClick={() => handleStaffToggle(staff.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`staff-${staff.id}`} 
                            checked={selectedStaff.includes(staff.id)} 
                            onCheckedChange={() => handleStaffToggle(staff.id)}
                          />
                          <label 
                            htmlFor={`staff-${staff.id}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {staff.name}
                          </label>
                          <span className="text-xs text-muted-foreground">({staff.role})</span>
                        </div>
                        
                        {selectedStaff.includes(staff.id) && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      No staff members found matching "{staffSearchQuery}"
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-sm text-muted-foreground border rounded-md p-4 text-center">
                No staff members found. Add staff in the Staff Management section.
              </div>
            )}
          </div>
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
