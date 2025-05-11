
import React from "react";
import { BusinessPage, BusinessPageSection, BusinessSocialLink, BusinessHour } from "@/types/business.types";
import BusinessAbout from "./BusinessAbout";
import BusinessGallery from "./BusinessGallery";
import BusinessTestimonials from "./BusinessTestimonials";
import BusinessHeader from "./BusinessHeader";
import BusinessContact from "./BusinessContact";
import BusinessHours from "./BusinessHours";

interface BusinessPageSectionsProps {
  pageSections: BusinessPageSection[];
  businessPage: BusinessPage;
  socialLinks?: BusinessSocialLink[];
  submitContactForm?: (data: any) => Promise<any>;
  businessHours?: BusinessHour[];
}

const BusinessPageSections = ({
  pageSections,
  businessPage,
  socialLinks,
  submitContactForm,
  businessHours
}: BusinessPageSectionsProps) => {
  // Log passed-in social links for debugging
  console.log("BusinessPageSections received socialLinks:", socialLinks);
  
  if (!pageSections || pageSections.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-600">No content available</h2>
        <p className="text-gray-500 mt-2">This business page has no content sections.</p>
      </div>
    );
  }
  
  const renderSection = (section: BusinessPageSection) => {
    if (!section.is_visible) return null;
    
    const { id, page_id, section_type, section_content, background_color, text_color } = section;
    
    const sectionStyle = {
      backgroundColor: background_color || '',
      color: text_color || ''
    };

    switch (section_type) {
      case 'header':
        return (
          <div key={id} style={sectionStyle}>
            <BusinessHeader 
              section={section} 
              businessPage={businessPage}
            />
          </div>
        );
      case 'about':
        return (
          <div key={id} style={sectionStyle}>
            <BusinessAbout 
              section={section} 
              businessId={businessPage.business_id}
              pageId={page_id}
              submitContactForm={submitContactForm}
              primaryColor={businessPage.primary_color}
              socialLinks={socialLinks}
            />
          </div>
        );
      case 'gallery':
        return (
          <div key={id} style={sectionStyle}>
            <BusinessGallery 
              section={section} 
            />
          </div>
        );
      case 'testimonials':
        return (
          <div key={id} style={sectionStyle}>
            <BusinessTestimonials 
              section={section} 
            />
          </div>
        );
      case 'contact':
        return (
          <div key={id} style={sectionStyle}>
            <BusinessContact 
              section={section}
              businessId={businessPage.business_id}
              pageId={page_id}
              submitContactForm={submitContactForm}
              primaryColor={businessPage.primary_color}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return <>{pageSections.map(renderSection)}</>;
};

export default BusinessPageSections;
