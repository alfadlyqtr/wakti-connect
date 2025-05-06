
import React from "react";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";
import BusinessHeader from "./BusinessHeader";
import BusinessAbout from "./BusinessAbout";
import BusinessContactInfo from "./BusinessContactInfo";
import BusinessGallery from "./BusinessGallery";
import BusinessHours from "./BusinessHours";
import BusinessChatbotSection from "./BusinessChatbotSection";
import BusinessInstagramSection from "./sections/InstagramSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import LinksSection from "./sections/LinksSection";
import { submitContactForm } from "@/services/contact";

interface BusinessPageSectionsProps {
  pageSections: BusinessPageSection[];
  businessPage: BusinessPage;
}

const BusinessPageSections: React.FC<BusinessPageSectionsProps> = ({ 
  pageSections, 
  businessPage 
}) => {
  // Sort sections by section_order
  const sortedSections = [...pageSections].sort(
    (a, b) => (a.section_order || 999) - (b.section_order || 999)
  );
  
  // Filter out sections that are not visible
  const visibleSections = sortedSections.filter(section => section.is_visible !== false);

  // Destructure common values from businessPage
  const {
    id: pageId,
    business_id: businessId,
    primary_color = "#3B82F6",
    text_color = "#FFFFFF"
  } = businessPage;

  return (
    <div className="space-y-8">
      {visibleSections.map((section) => {
        switch (section.section_type) {
          case 'header':
            return (
              <BusinessHeader
                key={section.id}
                section={section}
              />
            );
          case 'about':
            return (
              <BusinessAbout
                key={section.id}
                section={section}
              />
            );
          case 'contact':
            return (
              <div id="contact-section" key={section.id}>
                <BusinessContactInfo
                  section={section}
                  businessId={businessId}
                  pageId={pageId}
                  submitContactForm={submitContactForm}
                  primaryColor={primary_color}
                  textColor={text_color}
                />
              </div>
            );
          case 'gallery':
            return (
              <BusinessGallery
                key={section.id}
                section={section}
              />
            );
          case 'hours':
            return (
              <BusinessHours
                key={section.id}
                section={section}
              />
            );
          case 'chatbot':
            return (
              <BusinessChatbotSection
                key={section.id}
                content={section.section_content || {}}
              />
            );
          case 'instagram':
            return (
              <BusinessInstagramSection
                key={section.id}
                section={section}
              />
            );
          case 'testimonials':
            return (
              <TestimonialsSection
                key={section.id}
                section={section}
              />
            );
          case 'links':
            return (
              <LinksSection
                key={section.id}
                section={section}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default BusinessPageSections;
