
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ContactFormValues } from "./FormSchema";
import { useTranslation } from "react-i18next";

export interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormValues>;
  isSubmitting: boolean;
  onSubmit: (data: ContactFormValues) => void;
}

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  form,
  isSubmitting,
  onSubmit
}) => {
  const { t } = useTranslation();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.yourName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("contact.yourName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.yourEmail")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("contact.yourEmail")} type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact.phoneOptional")}</FormLabel>
              <FormControl>
                <Input placeholder={t("contact.phoneOptional")} type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact.subject")}</FormLabel>
              <FormControl>
                <Input placeholder={t("contact.messageSubject")} {...field} />
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
              <FormLabel>{t("contact.message")}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("contact.howCanWeHelp")} 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("contact.sending")}
            </>
          ) : (
            t("contact.send")
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContactFormFields;
