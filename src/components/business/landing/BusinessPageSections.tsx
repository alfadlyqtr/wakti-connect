
import React, { useEffect } from "react";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";
import BusinessPageHeader from "./sections/BusinessPageHeader";
import BusinessAbout from "./BusinessAbout";
import BusinessHours from "./BusinessHours";
import BusinessGallery from "./BusinessGallery";
import BusinessTestimonialsSection from "./sections/BusinessTestimonialsSection";
import BusinessBookingSection from "./sections/BusinessBookingSection";
import InstagramSection from "./sections/InstagramSection";
import ChatbotSection from "./sections/ChatbotSection";
import ContactSection from "./sections/ContactSection";
import { useSubmitContactFormMutation } from "@/hooks/business-page/useContactSubmissionMutation";
import { useBusinessHours } from "@/hooks/useBusinessHours";

interface BusinessPageSectionsProps {
  pageSections: BusinessPageSection[];
  businessPage: BusinessPage;
  businessHoursId?: string; // Add this prop
}

const BusinessPageSections: React.FC<BusinessPageSectionsProps> = ({ 
  pageSections, 
  businessPage,
  businessHoursId
}) => {
  // Get the submitContactForm mutation from our hook
  const contactFormMutation = useSubmitContactFormMutation();
  
  // Fetch business hours data
  const { businessHours, isLoading: isLoadingHours } = useBusinessHours(businessHoursId);
  
  // Sort sections by order
  const sortedSections = [...pageSections].sort((a, b) => a.section_order - b.section_order);
  
  // Handle contact form submission (this wraps the mutation function)
  const handleContactFormSubmit = async (data: any) => {
    return contactFormMutation.mutateAsync(data);
  };

  // Add debugging to log the sections and page data
  useEffect(() => {
    console.log("BusinessPageSections - Page Data:", businessPage);
    console.log("BusinessPageSections - Sorted Sections:", sortedSections);
    console.log("BusinessPageSections - Business Hours:", businessHours);
  }, [businessPage, sortedSections, businessHours]);

  return (
    <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20 mt-6">
      {sortedSections.map((section) => {
        if (!section.is_visible) {
          console.log(`Section ${section.section_type} (ID: ${section.id}) is not visible, skipping`);
          return null;
        }
        
        console.log(`Rendering section: ${section.section_type}`, section);
        
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
              <BusinessAbout 
                key={section.id} 
                section={section} 
                businessId={businessPage.business_id}
                pageId={businessPage.id}
                submitContactForm={handleContactFormSubmit}
                primaryColor={businessPage.primary_color}
              />
            );
          
          case 'hours':
            return (
              <BusinessHours
                key={section.id}
                section={section}
                businessHours={businessHours} // Pass the business hours data
              />
            );
          
          case 'gallery':
            return (
              <BusinessGallery
                key={section.id}
                section={section}
              />
            );
          
          case 'testimonials':
            return (
              <BusinessTestimonialsSection
                key={section.id}
                content={section.section_content || {}}
                primaryColor={businessPage.primary_color}
              />
            );
          
          case 'booking':
            return (
              <BusinessBookingSection
                key={section.id}
                content={section.section_content || {}}
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
          
          case 'contact':
            console.log("Rendering contact section with data:", {
              sectionId: section.id,
              content: section.section_content,
              businessId: businessPage.business_id,
              pageId: businessPage.id
            });
            
            return (
              <ContactSection
                key={section.id}
                section={section}
                businessId={businessPage.business_id}
                pageId={businessPage.id}
                submitContactForm={handleContactFormSubmit}
                primaryColor={businessPage.primary_color}
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
            console.warn(`Unknown section type: ${section.section_type}`);
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
