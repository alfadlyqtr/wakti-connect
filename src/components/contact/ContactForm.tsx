
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactFormSchema, ContactFormValues } from "@/components/contact/FormSchema";
import ContactFormFields from "@/components/contact/ContactFormFields";
import ContactSuccessDialog from "@/components/contact/ContactSuccessDialog";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      phone: ""
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
      toast.error(t("contact.messageFailed"));
      console.error("Contact form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-2xl font-bold mb-6">{t("contact.sendMessage")}</h2>
      
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
