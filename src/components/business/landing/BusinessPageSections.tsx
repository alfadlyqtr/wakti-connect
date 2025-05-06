
import React from "react";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";
import HeaderSection from "./sections/HeaderSection";
import AboutSection from "./sections/AboutSection";
import ContactSection from "./sections/ContactSection";
import BusinessGallerySection from "./sections/BusinessGallerySection";
import ChatbotSection from "./sections/ChatbotSection";
import InstagramSection from "./sections/InstagramSection";
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
  // Sort sections by display order
  const sortedSections = [...pageSections].sort(
    (a, b) => (a.display_order || 999) - (b.display_order || 999)
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
    <div className="space-y-2">
      {visibleSections.map((section) => {
        switch (section.section_type) {
          case 'header':
            return (
              <HeaderSection
                key={section.id}
                section={section}
              />
            );
          case 'about':
            return (
              <AboutSection
                key={section.id}
                section={section}
              />
            );
          case 'contact':
            return (
              <div id="contact-section" key={section.id}>
                <ContactSection
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
              <BusinessGallerySection
                key={section.id}
                content={section.section_content || {}}
              />
            );
          case 'chatbot':
            return (
              <ChatbotSection
                key={section.id}
                section={section}
              />
            );
          case 'instagram':
            return (
              <InstagramSection
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
