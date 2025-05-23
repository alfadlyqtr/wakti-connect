
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Simple schema with only name and phone required
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().optional().or(z.literal('')),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface BusinessContactFormProps {
  businessId: string;
  pageId: string;
  onSubmitSuccess?: () => void;
  submitForm?: (data: any) => Promise<any>;
  submitContactForm?: (data: any) => Promise<any>;
  primaryColor?: string;
  textColor?: string;
}

export function BusinessContactForm({ 
  businessId, 
  pageId, 
  onSubmitSuccess,
  submitForm,
  submitContactForm,
  primaryColor = "#3B82F6",
  textColor = "#FFFFFF"
}: BusinessContactFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize form context
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    try {
      setIsSubmitting(true);
      
      // Use submitForm if provided, otherwise fall back to submitContactForm
      const submitFunction = submitForm || submitContactForm;
      
      if (!submitFunction) {
        throw new Error("No submit function provided");
      }
      
      await submitFunction({
        businessId,
        pageId,
        formData: {
          name: values.name,
          phone: values.phone, // Ensure phone is included
          message: values.message || null,
          email: null // Set email to null as it's no longer in the form
        }
      });
      
      form.reset();
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone *</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 123-4567" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Your message here..." 
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            backgroundColor: primaryColor,
            color: textColor
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default BusinessContactForm;
