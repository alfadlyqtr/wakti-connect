
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { BookingTemplateWithRelations, BookingTemplateFormData } from "@/types/booking.types";

// Import form sections
import BasicInfoFields from "./form-sections/BasicInfoFields";
import ServiceSelector from "./form-sections/ServiceSelector";
import DurationAndPriceFields from "./form-sections/DurationAndPriceFields";
import StaffAssignment from "./form-sections/StaffAssignment";
import TimeSettings from "./form-sections/TimeSettings";
import PublishToggle from "./form-sections/PublishToggle";
import FormActions from "./form-sections/FormActions";

// Import custom hooks
import { useTemplateFormData } from "./hooks/useTemplateFormData";
import { useServiceSelection } from "./hooks/useServiceSelection";
import { useStaffSelection } from "./hooks/useStaffSelection";

// Form schema for booking template
const bookingTemplateFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  duration: z.number().min(5, "Duration must be at least 5 minutes"),
  price: z.number().optional(),
  service_id: z.string().optional(),
  staff_assigned_ids: z.array(z.string()).optional(),
  is_published: z.boolean().optional(),
  max_daily_bookings: z.number().optional(),
  default_starting_hour: z.number().min(0).max(23).default(9),
  default_ending_hour: z.number().min(0).max(23).default(17)
});

type BookingTemplateFormValues = z.infer<typeof bookingTemplateFormSchema>;

interface BookingTemplateFormProps {
  initialData?: BookingTemplateWithRelations;
  onSubmit: (data: BookingTemplateFormData) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
}

const BookingTemplateForm: React.FC<BookingTemplateFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isPending
}) => {
  // Fetch services and staff data
  const { services, staff, isLoadingData } = useTemplateFormData();
  
  // Initialize form
  const form = useForm<BookingTemplateFormValues>({
    resolver: zodResolver(bookingTemplateFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      duration: initialData?.duration || 30,
      price: initialData?.price || undefined,
      service_id: initialData?.service_id || undefined,
      staff_assigned_ids: initialData?.staff_assigned_id ? [initialData.staff_assigned_id] : [],
      is_published: initialData?.is_published || false,
      max_daily_bookings: initialData?.max_daily_bookings || undefined,
      default_starting_hour: initialData?.default_starting_hour || 9,
      default_ending_hour: initialData?.default_ending_hour || 17
    }
  });

  // Service selection logic
  const { handleServiceChange } = useServiceSelection(
    services, 
    initialData?.service_id, 
    form.setValue
  );

  // Staff selection logic
  const { selectedStaffIds, handleStaffChange } = useStaffSelection(
    initialData?.staff_assigned_id
  );

  // Handle form submission
  const handleSubmit = async (values: BookingTemplateFormValues) => {
    try {
      // Prepare data for API
      const templateData: BookingTemplateFormData = {
        name: values.name,
        description: values.description || null,
        duration: values.duration,
        price: values.price || null,
        service_id: values.service_id === "none" ? null : values.service_id || null,
        staff_assigned_ids: selectedStaffIds.length > 0 ? selectedStaffIds : undefined,
        is_published: values.is_published || false,
        max_daily_bookings: values.max_daily_bookings || null,
        default_starting_hour: values.default_starting_hour,
        default_ending_hour: values.default_ending_hour
      };
      
      await onSubmit(templateData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields control={form.control} />
        
        <ServiceSelector 
          control={form.control} 
          services={services} 
          onServiceChange={handleServiceChange} 
        />
        
        <DurationAndPriceFields control={form.control} />
        
        <StaffAssignment 
          control={form.control} 
          staff={staff} 
          selectedStaffIds={selectedStaffIds} 
          onStaffChange={handleStaffChange} 
        />
        
        <TimeSettings control={form.control} />
        
        <PublishToggle control={form.control} />
        
        <FormActions 
          onCancel={onCancel} 
          isPending={isPending} 
          isEditing={!!initialData} 
        />
      </form>
    </Form>
  );
};

export default BookingTemplateForm;
