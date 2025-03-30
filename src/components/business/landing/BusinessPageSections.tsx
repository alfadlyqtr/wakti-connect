
import React from "react";
import { BusinessPageSection, BusinessPage } from "@/types/business.types";

// Import section renderers
import BusinessPageHeader from "./sections/BusinessPageHeader";
import BusinessAboutSection from "./sections/BusinessAboutSection";
import BusinessContactSection from "./sections/BusinessContactSection";
import BusinessHoursSection from "./sections/BusinessHoursSection";
import BusinessGallerySection from "./sections/BusinessGallerySection";
import BusinessTestimonialsSection from "./sections/BusinessTestimonialsSection";
import BusinessBookingTemplatesSection from "./sections/BusinessBookingTemplatesSection";
import BusinessInstagramSection from "./sections/BusinessInstagramSection";
import { cn } from "@/lib/utils";

interface BusinessPageSectionsProps {
  pageSections: BusinessPageSection[];
  businessPage: BusinessPage;
}

const BusinessPageSections = ({ pageSections, businessPage }: BusinessPageSectionsProps) => {
  if (!pageSections || pageSections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No content sections available.</p>
      </div>
    );
  }
  
  const getSectionStyles = (section: BusinessPageSection) => {
    const defaultBorderRadius = businessPage.border_radius || 'medium';
    
    const borderRadiusValue = 
      (section.border_radius || defaultBorderRadius) === 'none' ? '0px' :
      (section.border_radius || defaultBorderRadius) === 'small' ? '4px' :
      (section.border_radius || defaultBorderRadius) === 'medium' ? '8px' :
      (section.border_radius || defaultBorderRadius) === 'large' ? '12px' :
      (section.border_radius || defaultBorderRadius) === 'full' ? '9999px' : '8px';
    
    return {
      backgroundColor: section.background_color || 'transparent',
      color: section.text_color || 'inherit',
      padding: section.padding || '0',
      borderRadius: borderRadiusValue,
      ...(section.background_image_url && {
        backgroundImage: `url(${section.background_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      })
    };
  };

  const renderSection = (section: BusinessPageSection) => {
    if (!section.is_visible) return null;
    
    const content = section.section_content || {};
    const sectionStyles = getSectionStyles(section);
    
    const sectionClasses = cn(
      "section-wrapper",
      section.background_color || section.background_image_url ? "p-6 sm:p-8 md:p-10" : "",
      section.background_color ? "rounded-lg" : ""
    );
    
    const SectionComponent = () => {
      switch (section.section_type) {
        case 'header':
          return <BusinessPageHeader content={content} />;
          
        case 'about':
          return <BusinessAboutSection content={content} />;
          
        case 'contact':
          return <BusinessContactSection 
            content={content} 
            businessId={businessPage.business_id} 
            pageId={businessPage.id} 
          />;
          
        case 'hours':
          return <BusinessHoursSection content={content} />;
          
        case 'gallery':
          return <BusinessGallerySection content={content} />;
          
        case 'testimonials':
          return <BusinessTestimonialsSection content={content} />;
  
        case 'booking':
          return <BusinessBookingTemplatesSection content={content} businessId={businessPage.business_id} />;
          
        case 'instagram':
          return <BusinessInstagramSection content={content} />;
          
        default:
          return (
            <div className="py-8">
              <h2 className="text-2xl font-bold mb-4 capitalize">{section.section_type}</h2>
              <p className="text-muted-foreground">
                This section type is not yet supported for display.
              </p>
            </div>
          );
      }
    };
    
    return (
      <div key={section.id} className={sectionClasses} style={sectionStyles}>
        <SectionComponent />
      </div>
    );
  };

  return (
    <>
      {pageSections
        .sort((a, b) => a.section_order - b.section_order)
        .map(renderSection)}
    </>
  );
};

export default BusinessPageSections;
