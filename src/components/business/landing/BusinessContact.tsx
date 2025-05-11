
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface BusinessContactProps {
  section: BusinessPageSection;
  businessId?: string;
  pageId?: string;
  submitContactForm?: (data: any) => Promise<any>;
  primaryColor?: string;
}

const BusinessContact: React.FC<BusinessContactProps> = ({
  section,
  businessId,
  pageId,
  submitContactForm,
  primaryColor
}) => {
  const content = section.section_content || {};
  const {
    title = "Contact Us",
    email = "",
    phone = "",
    address = "",
    formEnabled = true,
    showContactInfo = true
  } = content;

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data: any) => {
    if (!submitContactForm) {
      toast({
        title: "Error",
        description: "Contact form submission is not available.",
        variant: "destructive"
      });
      return;
    }

    try {
      await submitContactForm({
        ...data,
        businessId,
        pageId
      });
      
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon."
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Custom button style based on business page primary color
  const buttonStyle = primaryColor ? {
    backgroundColor: primaryColor,
    color: "#ffffff"
  } : {};

  return (
    <div className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {showContactInfo && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                {email && (
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">{email}</p>
                  </div>
                )}
                
                {phone && (
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">{phone}</p>
                  </div>
                )}
                
                {address && (
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{address}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {formEnabled && (
          <div>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      {...register("name", { required: "Name is required" })}
                      className="w-full"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message as string}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address"
                        }
                      })}
                      className="w-full"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message as string}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Textarea
                      placeholder="Your Message"
                      {...register("message", { required: "Message is required" })}
                      className="w-full min-h-[100px]"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.message.message as string}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    style={buttonStyle}
                    className="w-full"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessContact;
