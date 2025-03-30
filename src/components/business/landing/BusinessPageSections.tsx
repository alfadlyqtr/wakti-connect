
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
    
    // Convert border radius settings to actual CSS values
    const borderRadiusValue = 
      (section.border_radius || defaultBorderRadius) === 'none' ? '0px' :
      (section.border_radius || defaultBorderRadius) === 'small' ? '4px' :
      (section.border_radius || defaultBorderRadius) === 'medium' ? '8px' :
      (section.border_radius || defaultBorderRadius) === 'large' ? '12px' :
      (section.border_radius || defaultBorderRadius) === 'full' ? '9999px' : '8px';
    
    // Convert padding settings to actual CSS values
    const paddingValue = 
      (section.padding) === 'none' ? '0' :
      (section.padding) === 'sm' ? '0.5rem' :
      (section.padding) === 'md' ? '1rem' :
      (section.padding) === 'lg' ? '1.5rem' :
      (section.padding) === 'xl' ? '2rem' : '0';
    
    return {
      backgroundColor: section.background_color || 'transparent',
      color: section.text_color || 'inherit',
      padding: paddingValue,
      borderRadius: borderRadiusValue,
      ...(section.background_image_url && {
        backgroundImage: `url(${section.background_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      })
    };
  };

  const renderSection = (section: BusinessPageSection) => {
    if (!section.is_visible) return null;
    
    const content = section.section_content || {};
    const sectionStyles = getSectionStyles(section);
    
    // Only add padding classes when background color or image is set
    const hasBgOrPadding = section.background_color || section.background_image_url || section.padding;
    
    const sectionClasses = cn(
      "section-wrapper mb-8 relative",
      hasBgOrPadding ? "rounded-lg overflow-hidden" : "",
      section.background_image_url ? "text-white" : ""
    );
    
    // Add overlay for text readability when using background image
    const hasOverlay = section.background_image_url && !section.background_color;
    
    const SectionComponent = () => {
      switch (section.section_type) {
        case 'header':
          return <BusinessPageHeader content={content} />;
          
        case 'about':
          return <BusinessAboutSection content={content} />;
          
        case 'contact':
          return <BusinessContactSection content={content} businessId={businessPage.business_id} />;
          
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
        {/* Add semi-transparent overlay for background images to improve text readability */}
        {hasOverlay && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            style={{ zIndex: 0 }}
          />
        )}
        
        {/* Wrap content in relative container to appear above overlay */}
        <div className={cn("relative", hasOverlay ? "z-10" : "")}>
          <SectionComponent />
        </div>
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
