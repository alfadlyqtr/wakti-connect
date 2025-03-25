
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BookingTemplateWithRelations, BookingTemplateFormData } from "@/types/booking.types";
import { Service } from "@/types/service.types";
import { StaffMember } from "@/types/staff";

// Form schema for booking template
const bookingTemplateFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  duration: z.number().min(5, "Duration must be at least 5 minutes"),
  price: z.number().optional(),
  service_id: z.string().optional(),
  staff_assigned_id: z.string().optional(),
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
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Initialize form
  const form = useForm<BookingTemplateFormValues>({
    resolver: zodResolver(bookingTemplateFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      duration: initialData?.duration || 30,
      price: initialData?.price || undefined,
      service_id: initialData?.service_id || undefined,
      staff_assigned_id: initialData?.staff_assigned_id || undefined,
      is_published: initialData?.is_published || false,
      max_daily_bookings: initialData?.max_daily_bookings || undefined,
      default_starting_hour: initialData?.default_starting_hour || 9,
      default_ending_hour: initialData?.default_ending_hour || 17
    }
  });

  // Fetch services and staff on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('business_services')
          .select('*')
          .order('name');
          
        if (servicesError) throw servicesError;
        
        // Fetch staff
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('id, staff_id, business_id, name, role, is_service_provider')
          .eq('is_service_provider', true)
          .eq('status', 'active')
          .order('name');
          
        if (staffError) throw staffError;
        
        setServices(servicesData || []);
        setStaff(staffData as StaffMember[] || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (values: BookingTemplateFormValues) => {
    try {
      // Prepare data for API
      const templateData: BookingTemplateFormData = {
        name: values.name,
        description: values.description || null,
        duration: values.duration,
        price: values.price || null,
        service_id: values.service_id || null,
        staff_assigned_id: values.staff_assigned_id || null,
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., One-hour Consultation" {...field} />
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe this booking template" 
                  {...field} 
                  value={field.value || ""} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={5} 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                <FormLabel>Price (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="Leave empty for variable pricing" 
                    {...field}
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="service_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linked Service (Optional)</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="staff_assigned_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Staff (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to staff" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Any available staff</SelectItem>
                    {staff.map((staffMember) => (
                      <SelectItem key={staffMember.id} value={staffMember.id}>
                        {staffMember.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="default_starting_hour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Starting Hour</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0} 
                    max={23} 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="default_ending_hour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Ending Hour</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0} 
                    max={23} 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="max_daily_bookings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Daily Bookings (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  placeholder="Leave empty for unlimited" 
                  {...field}
                  value={field.value === undefined ? "" : field.value}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Publish Template
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Make this template visible to customers on your booking page
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              initialData ? 'Update Template' : 'Create Template'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingTemplateForm;
