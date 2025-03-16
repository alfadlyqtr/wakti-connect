
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

import { contactFormSchema, ContactFormValues } from "./contact/FormSchema";
import ContactFormFields from "./contact/ContactFormFields";
import ContactSuccessDialog from "./contact/ContactSuccessDialog";

const ContactForm = () => {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would send the form data to your backend
      console.log("Form submitted:", data);
      
      setIsSubmitSuccessful(true);
      setShowSuccessDialog(true);
      
      // Show toast notification
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you shortly.",
        variant: "default",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-background rounded-lg border p-6">
      <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
      
      <ContactFormFields 
        form={form} 
        isSubmitting={isSubmitting} 
        onSubmit={onSubmit} 
      />

      <ContactSuccessDialog 
        open={showSuccessDialog} 
        onOpenChange={setShowSuccessDialog} 
      />
    </div>
  );
};

export default ContactForm;
