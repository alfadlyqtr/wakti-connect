
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

export interface BusinessPageSectionsProps {
  pageSections: BusinessPageSection[];
  businessPage: BusinessPage;
}

const BusinessPageSections = ({ pageSections, businessPage }: BusinessPageSectionsProps) => {
  // Log the primary and secondary colors to verify they're properly passed
  console.log("BusinessPageSections received colors:", {
    primary: businessPage.primary_color,
    secondary: businessPage.secondary_color,
    sections: pageSections.length
  });

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
    
    // Calculate padding based on section settings
    const paddingValue = 
      section.padding === 'none' ? '0' :
      section.padding === 'sm' ? '1rem' :
      section.padding === 'md' ? '2rem' :
      section.padding === 'lg' ? '3rem' :
      section.padding === 'xl' ? '4rem' : '1rem';
    
    // Calculate shadow based on section settings
    const shadowValue = 
      section.section_content?.shadow_effect === 'none' ? 'none' :
      section.section_content?.shadow_effect === 'sm' ? '0 1px 2px rgba(0,0,0,0.1)' :
      section.section_content?.shadow_effect === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
      section.section_content?.shadow_effect === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' :
      section.section_content?.shadow_effect === 'xl' ? '0 20px 25px rgba(0,0,0,0.1)' : 'none';
    
    // Calculate border style, width and color
    const borderStyle = section.section_content?.border_style || 'none';
    const borderWidth = section.section_content?.border_width || '1px';
    const borderColor = section.section_content?.border_color || '#000000';
    
    // Calculate section style (outlined, solid, default)
    const sectionStyle = section.section_content?.section_style || 'default';
    
    // Build the style object
    const styles: React.CSSProperties = {
      backgroundColor: section.background_color || 'transparent',
      color: section.text_color || businessPage.text_color || 'inherit',
      padding: paddingValue,
      borderRadius: borderRadiusValue,
      boxShadow: section.section_content?.shadow_effect !== 'none' ? shadowValue : 'none',
      ...(section.background_image_url && {
        backgroundImage: `url(${section.background_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      })
    };
    
    // Add border if it's not "none"
    if (borderStyle !== 'none') {
      styles.borderStyle = borderStyle;
      styles.borderWidth = borderWidth;
      styles.borderColor = borderColor;
    }
    
    // Handle section style
    if (sectionStyle === 'outlined') {
      styles.backgroundColor = 'transparent';
      styles.borderStyle = 'solid';
      styles.borderWidth = '1px';
      styles.borderColor = section.background_color || '#000000';
    } else if (sectionStyle === 'solid') {
      styles.backgroundColor = section.background_color || '#ffffff';
    }
    
    return styles;
  };

  const renderSection = (section: BusinessPageSection) => {
    if (!section.is_visible) return null;
    
    const content = section.section_content || {};
    const sectionStyles = getSectionStyles(section);
    
    const sectionClasses = cn(
      "section-wrapper mb-8",
      section.background_color || section.background_image_url ? "rounded overflow-hidden" : ""
    );
    
    console.log(`Rendering section ${section.section_type} with content:`, content);
    
    const SectionComponent = () => {
      switch (section.section_type) {
        case 'header':
          return <BusinessPageHeader 
            content={{ 
              ...content, 
              primary_color: businessPage.primary_color, 
              secondary_color: businessPage.secondary_color,
              logo_url: businessPage.logo_url
            }} 
          />;
          
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
          return <BusinessBookingTemplatesSection 
            content={content} 
            businessId={businessPage.business_id}
          />;
          
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
    
    console.log(`Rendering section: ${section.section_type} with styles:`, sectionStyles);
    
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
