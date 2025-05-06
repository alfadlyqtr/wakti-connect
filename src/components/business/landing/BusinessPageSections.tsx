
import React from "react";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";
import { BusinessPageHeader } from "./sections/BusinessPageHeader";
import AboutSection from "./sections/AboutSection";
import ContactSection from "./sections/ContactSection";
import HoursSection from "./sections/HoursSection";
import GallerySection from "./sections/GallerySection";
import TestimonialsSection from "./sections/TestimonialsSection";
import BookingSection from "./sections/BookingSection";
import InstagramSection from "./sections/InstagramSection";
import ChatbotSection from "./sections/ChatbotSection";
import { submitContactForm } from "@/services/contact";
import { useSubmitContactFormMutation } from "@/hooks/business-page/useContactSubmissionMutation";

interface BusinessPageSectionsProps {
  pageSections: BusinessPageSection[];
  businessPage: BusinessPage;
}

const BusinessPageSections: React.FC<BusinessPageSectionsProps> = ({ 
  pageSections, 
  businessPage 
}) => {
  // Get the submitContactForm mutation from our hook
  const contactFormMutation = useSubmitContactFormMutation();
  
  // Sort sections by order
  const sortedSections = [...pageSections].sort((a, b) => a.section_order - b.section_order);
  
  // Handle contact form submission (this wraps the mutation function)
  const handleContactFormSubmit = async (data: any) => {
    return contactFormMutation.mutateAsync(data);
  };

  return (
    <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20 mt-6">
      {sortedSections.map((section) => {
        if (!section.is_visible) return null;
        
        switch (section.section_type) {
          case 'header':
            return (
              <BusinessPageHeader
                key={section.id}
                content={{
                  ...section.section_content,
                  logo_url: businessPage.logo_url,
                  primary_color: businessPage.primary_color,
                  secondary_color: businessPage.secondary_color,
                }}
              />
            );
          
          case 'about':
            return (
              <AboutSection 
                key={section.id} 
                section={section} 
                primaryColor={businessPage.primary_color}
              />
            );
          
          case 'contact':
            return (
              <ContactSection
                key={section.id}
                section={section}
                businessId={businessPage.business_id}
                pageId={businessPage.id}
                submitContactForm={handleContactFormSubmit}
                primaryColor={businessPage.primary_color}
                textColor={businessPage.text_color || '#FFFFFF'}
              />
            );
          
          case 'hours':
            return (
              <HoursSection
                key={section.id}
                section={section}
                primaryColor={businessPage.primary_color}
              />
            );
          
          case 'gallery':
            return (
              <GallerySection
                key={section.id}
                section={section}
                primaryColor={businessPage.primary_color}
              />
            );
          
          case 'testimonials':
            return (
              <TestimonialsSection
                key={section.id}
                section={section}
                primaryColor={businessPage.primary_color}
              />
            );
          
          case 'booking':
            return (
              <BookingSection
                key={section.id}
                section={section}
                businessId={businessPage.business_id}
                primaryColor={businessPage.primary_color}
              />
            );
          
          case 'instagram':
            return (
              <InstagramSection
                key={section.id}
                section={section}
              />
            );
          
          case 'chatbot':
            return (
              <ChatbotSection
                key={section.id}
                section={section}
                businessId={businessPage.business_id}
              />
            );
          
          default:
            return (
              <div key={section.id} className="p-4 border rounded-md">
                <p className="text-center text-muted-foreground">
                  Unknown section type: {section.section_type}
                </p>
              </div>
            );
        }
      })}
    </div>
  );
};

export default BusinessPageSections;
