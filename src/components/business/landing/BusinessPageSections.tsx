
import React from "react";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";
import BusinessHeader from "./BusinessHeader";
import BusinessAbout from "./BusinessAbout";
import ContactSection from "./sections/ContactSection";
import BusinessContactForm from "./BusinessContactForm";
import BusinessGallery from "./BusinessGallery";
import BusinessHours from "./BusinessHours";
import BusinessTestimonials from "./BusinessTestimonials";
import BusinessContactInfo from "./BusinessContactInfo";
import BusinessChatbotSection from "./BusinessChatbotSection";
import { submitContactForm } from "@/services/contact";
import BusinessContactSection from "./sections/BusinessContactSection";

interface BusinessPageSectionsProps {
  pageSections: BusinessPageSection[];
  businessPage: BusinessPage;
}

const BusinessPageSections: React.FC<BusinessPageSectionsProps> = ({
  pageSections,
  businessPage
}) => {
  // Sort sections by their section_order
  const sortedSections = [...pageSections].sort(
    (a, b) => (a.section_order || 0) - (b.section_order || 0)
  );

  // Check if a contact section exists
  const hasContactSection = sortedSections.some(
    section => section.section_type === 'contact' && section.is_visible
  );

  // Render each section based on its type
  return (
    <div className="space-y-8 md:space-y-16 my-8">
      {sortedSections.map((section) => {
        if (!section.is_visible) return null;

        switch (section.section_type) {
          case "header":
            return (
              <div key={section.id}>
                <BusinessHeader
                  section={section}
                  businessPage={businessPage}
                />
              </div>
            );

          case "about":
            return (
              <div key={section.id}>
                <BusinessAbout
                  section={section}
                />
              </div>
            );

          case "contact":
            // Pass relevant business info to the contact section
            if (section.section_content?.contactFormStyle === "detailed") {
              return (
                <div key={section.id} id="contact">
                  <ContactSection
                    section={section}
                    businessId={businessPage.business_id}
                    pageId={businessPage.id}
                    submitContactForm={submitContactForm}
                    primaryColor={businessPage.primary_color}
                    textColor={businessPage.text_color}
                  />
                </div>
              );
            } else if (section.section_content?.contactFormStyle === "info") {
              return (
                <div key={section.id} id="contact">
                  <BusinessContactInfo
                    section={section}
                  />
                </div>
              );
            } else {
              // Simple contact section
              return (
                <div key={section.id} id="contact">
                  <BusinessContactSection
                    content={section.section_content || {}}
                    businessName={businessPage.page_title}
                    businessAddress={section.section_content?.address}
                    businessPhoneNumber={section.section_content?.phone}
                    businessEmail={section.section_content?.email}
                  />
                </div>
              );
            }

          case "gallery":
            return (
              <div key={section.id}>
                <BusinessGallery
                  section={section}
                  businessPage={businessPage}
                />
              </div>
            );

          case "hours":
            return (
              <div key={section.id}>
                <BusinessHours
                  section={section}
                />
              </div>
            );

          case "testimonials":
            return (
              <div key={section.id}>
                <BusinessTestimonials
                  section={section}
                />
              </div>
            );

          case "chatbot":
            return (
              <div key={section.id}>
                <BusinessChatbotSection
                  section={section}
                  businessPage={businessPage}
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default BusinessPageSections;
