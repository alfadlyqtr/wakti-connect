
import React from "react";
import BusinessContactForm from "../BusinessContactForm";
import { BusinessPageSection } from "@/types/business.types";

interface ContactSectionProps {
  section: BusinessPageSection;
  businessId: string;
  pageId: string;
  submitContactForm: (data: any) => Promise<any>;
  primaryColor?: string;
  textColor?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  section,
  businessId,
  pageId,
  submitContactForm,
  primaryColor = "#3B82F6",
  textColor = "#FFFFFF"
}) => {
  const content = section.section_content || {};
  const {
    title = "Get in Touch",
    description = "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    background_color = "#f8f9fa",
    text_color = "#333333"
  } = content;

  // This wraps the contact form submission with the necessary business and page IDs
  const handleSubmit = async (formData: any) => {
    try {
      return await submitContactForm({
        businessId,
        pageId,
        formData
      });
    } catch (error) {
      console.error("Error in contact form submission:", error);
      throw error;
    }
  };

  return (
    <section 
      className="py-12 md:py-16" 
      style={{ 
        backgroundColor: section.background_color || background_color,
        color: section.text_color || text_color
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <BusinessContactForm
            businessId={businessId}
            pageId={pageId}
            submitContactForm={handleSubmit}
            primaryColor={primaryColor}
            textColor={textColor}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
