
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BusinessContactForm from "./BusinessContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

interface ContactSectionProps {
  section: BusinessPageSection;
  businessId: string;
  pageId: string;
  submitContactForm: any;
  primaryColor?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  section,
  businessId,
  pageId,
  submitContactForm,
  primaryColor = "#3B82F6"
}) => {
  const content = section.section_content || {};
  const styles = {
    backgroundColor: section.background_color || "transparent",
    color: section.text_color || "inherit",
    padding: 
      section.padding === "none" ? "0" :
      section.padding === "sm" ? "1rem" :
      section.padding === "md" ? "2rem" :
      section.padding === "lg" ? "3rem" :
      section.padding === "xl" ? "4rem" : "2rem",
    borderRadius: 
      section.border_radius === "none" ? "0" :
      section.border_radius === "small" ? "0.25rem" :
      section.border_radius === "medium" ? "0.5rem" :
      section.border_radius === "large" ? "1rem" :
      section.border_radius === "full" ? "999px" : "0.5rem",
  };

  const contactInfo = {
    title: content.title || "Contact Us",
    subtitle: content.subtitle || "We'd love to hear from you",
    description: content.description || "Fill out the form below to get in touch with us.",
    email: content.email || "",
    phone: content.phone || "",
    address: content.address || "",
    hours: content.hours || ""
  };

  return (
    <section style={styles} className={`my-8 ${!section.is_visible ? 'hidden' : ''}`}>
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{contactInfo.title}</h2>
          <p className="text-lg text-muted-foreground mt-2">{contactInfo.subtitle}</p>
          {contactInfo.description && (
            <p className="mt-4 max-w-2xl mx-auto">{contactInfo.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Fill out this form and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessContactForm 
                  businessId={businessId}
                  pageId={pageId}
                  submitContactForm={submitContactForm}
                  primaryColor={primaryColor}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {(contactInfo.email || contactInfo.phone || contactInfo.address) && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    You can also reach us using the following information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 mt-0.5" style={{ color: primaryColor }} />
                      <div>
                        <div className="font-medium">Email</div>
                        <a 
                          href={`mailto:${contactInfo.email}`} 
                          className="text-muted-foreground hover:underline"
                          style={{ color: primaryColor }}
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {contactInfo.phone && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 mt-0.5" style={{ color: primaryColor }} />
                      <div>
                        <div className="font-medium">Phone</div>
                        <a 
                          href={`tel:${contactInfo.phone}`} 
                          className="text-muted-foreground hover:underline"
                          style={{ color: primaryColor }}
                        >
                          {contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {contactInfo.address && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 mt-0.5" style={{ color: primaryColor }} />
                      <div>
                        <div className="font-medium">Address</div>
                        <address className="text-muted-foreground not-italic">
                          {contactInfo.address}
                        </address>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {contactInfo.hours && (
              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 mt-0.5" style={{ color: primaryColor }} />
                    <div>
                      <div className="font-medium">Hours</div>
                      <div className="text-muted-foreground whitespace-pre-line">
                        {contactInfo.hours}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
