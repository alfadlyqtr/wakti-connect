
import React from "react";
import { BusinessPage, BusinessPageSection, BusinessSocialLink, BusinessHour } from "@/types/business.types";
import BusinessAbout from "./BusinessAbout";
import BusinessGallery from "./BusinessGallery";
import BusinessTestimonials from "./BusinessTestimonials";
import BusinessHeader from "./BusinessHeader";
import BusinessContact from "./BusinessContact";
import BusinessHours from "./BusinessHours";
import BusinessBookingTemplatesSection from "./sections/BusinessBookingTemplatesSection";

interface BusinessPageSectionsProps {
  pageSections: BusinessPageSection[];
  businessPage: BusinessPage;
  socialLinks?: BusinessSocialLink[];
  businessProfile?: any; // Add business profile data
  submitContactForm?: (data: any) => Promise<any>;
  businessHours?: BusinessHour[];
}

const BusinessPageSections = ({
  pageSections,
  businessPage,
  socialLinks,
  businessProfile, // Include business profile data
  submitContactForm,
  businessHours
}: BusinessPageSectionsProps) => {
  // Log passed-in social links for debugging
  console.log("BusinessPageSections received pageSections:", pageSections);
  console.log("BusinessPageSections received businessProfile:", businessProfile);
  
  if (!pageSections || pageSections.length === 0) {
    // If no sections, create a default booking section
    return (
      <div className="space-y-8">
        <div className="py-12 text-center" style={{ color: businessPage.text_color || '#333333' }}>
          <h2 className="text-2xl font-semibold">About {businessPage.page_title || businessProfile?.business_name}</h2>
          <p className="mt-2">{businessPage.description || businessProfile?.description || 'Welcome to our business page.'}</p>
        </div>
        
        {/* Always show a booking section if available */}
        <BusinessBookingTemplatesSection 
          content={{
            title: 'Our Services',
            description: 'Book your appointment online',
            textColor: businessPage.text_color || '#333333'
          }}
          businessId={businessPage.business_id}
        />
      </div>
    );
  }
  
  const renderSection = (section: BusinessPageSection) => {
    if (!section.is_visible) return null;
    
    const { id, page_id, section_type, section_content, background_color, text_color } = section;
    
    const sectionStyle = {
      backgroundColor: background_color || businessPage.background_color || '',
      color: text_color || businessPage.text_color || '#333333'
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
              businessProfile={businessProfile}
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
      case 'booking':
        return (
          <div key={id} style={sectionStyle}>
            <BusinessBookingTemplatesSection 
              content={{
                ...section_content,
                textColor: text_color || businessPage.text_color || '#333333'
              }}
              businessId={businessPage.business_id}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  // Always add a booking section at the end if one doesn't exist yet
  const hasBookingSection = pageSections.some(section => section.section_type === 'booking');
  
  return (
    <div className="space-y-8">
      {pageSections.map(renderSection)}
      
      {/* Always add a booking section if one doesn't exist */}
      {!hasBookingSection && (
        <div style={{ color: businessPage.text_color || '#333333' }}>
          <BusinessBookingTemplatesSection 
            content={{
              title: 'Our Services',
              description: 'Book your appointment online',
              textColor: businessPage.text_color || '#333333'
            }}
            businessId={businessPage.business_id}
          />
        </div>
      )}
    </div>
  );
};

export default BusinessPageSections;
