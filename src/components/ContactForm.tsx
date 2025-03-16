
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, ContactFormValues } from "@/components/contact/FormSchema";
import ContactFormFields from "@/components/contact/ContactFormFields";
import ContactSuccessDialog from "@/components/contact/ContactSuccessDialog";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setShowSuccessDialog(true);
      form.reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Contact form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
      
      <ContactFormFields 
        form={form} 
        isSubmitting={isSubmitting} 
        onSubmit={onSubmit} 
      />
      
      <ContactSuccessDialog 
        open={showSuccessDialog} 
        onClose={() => setShowSuccessDialog(false)} 
      />
    </div>
  );
};

export default ContactForm;
