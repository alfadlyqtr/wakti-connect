
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { BookingFormData } from "@/types/booking.types";
import { useTemplateFormData } from "@/components/bookings/templates/hooks/useTemplateFormData";
import { useServiceSelection } from "@/components/bookings/templates/hooks/useServiceSelection";
import { useTranslation } from "react-i18next";

// Import form sections
import CustomerInfoFields from "./form-sections/CustomerInfoFields";
import BookingDetailsFields from "./form-sections/BookingDetailsFields";
import BookingDateTimeFields from "./form-sections/BookingDateTimeFields";
import StaffServiceFields from "./form-sections/StaffServiceFields";
import FormActions from "@/components/bookings/templates/form-sections/FormActions";

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, onCancel, isPending }) => {
  const { t } = useTranslation();
  const { services, staff, isLoadingData } = useTemplateFormData();
  
  // Form schema for booking with translations
  const bookingFormSchema = z.object({
    title: z.string().min(2, t('validation.titleRequired')),
    description: z.string().optional(),
    customer_name: z.string().min(2, t('validation.customerNameRequired')),
    customer_email: z.string().email(t('validation.validEmailRequired')),
    service_id: z.string().optional(),
    staff_assigned_id: z.string().optional(),
    date: z.date({
      required_error: t('validation.dateRequired'),
    }),
    start_time: z.string().min(1, t('validation.startTimeRequired')),
    end_time: z.string().min(1, t('validation.endTimeRequired')),
  });

  type BookingFormSchema = z.infer<typeof bookingFormSchema>;
  
  // Initialize form
  const form = useForm<BookingFormSchema>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      customer_name: "",
      customer_email: "",
      service_id: undefined,
      staff_assigned_id: undefined,
      date: new Date(),
      start_time: "",
      end_time: "",
    }
  });

  // Use service selection hook to handle service-related logic
  const { selectedServiceId, handleServiceSelection } = useServiceSelection(
    services,
    form.watch('service_id'),
    (name, value) => form.setValue(name as any, value)
  );

  // Handle form submission
  const handleSubmit = async (values: BookingFormSchema) => {
    try {
      // Combine date and times into ISO strings
      const date = values.date;
      const [startHours, startMinutes] = values.start_time.split(':').map(Number);
      const [endHours, endMinutes] = values.end_time.split(':').map(Number);
      
      const startDate = new Date(date);
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(endHours, endMinutes, 0, 0);
      
      // Prepare data for API
      const bookingData: BookingFormData = {
        title: values.title,
        description: values.description,
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        service_id: values.service_id,
        staff_assigned_id: values.staff_assigned_id,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        status: "pending" // Set default status to pending
      };
      
      await onSubmit(bookingData);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
          <div className="space-y-6">
            <BookingDetailsFields 
              control={form.control} 
            />
            
            <CustomerInfoFields 
              control={form.control} 
            />
          </div>
          
          <div className="space-y-6">
            <StaffServiceFields 
              control={form.control} 
              services={services}
              staff={staff}
              onServiceChange={handleServiceSelection}
            />
            
            <BookingDateTimeFields 
              control={form.control}
              selectedService={services.find(s => s.id === selectedServiceId)}
              watch={form.watch}
              setValue={form.setValue}
            />
          </div>
        </div>
        
        <FormActions 
          onCancel={onCancel} 
          isPending={isPending}
          isEditing={false}
        />
      </form>
    </Form>
  );
};

export default BookingForm;
