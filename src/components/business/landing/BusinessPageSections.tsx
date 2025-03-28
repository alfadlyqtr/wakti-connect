
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

  const renderSection = (section: BusinessPageSection) => {
    if (!section.is_visible) return null;
    
    const content = section.section_content || {};
    
    switch (section.section_type) {
      case 'header':
        return <BusinessPageHeader key={section.id} content={content} />;
        
      case 'about':
        return <BusinessAboutSection key={section.id} content={content} />;
        
      case 'contact':
        return <BusinessContactSection key={section.id} content={content} businessId={businessPage.business_id} />;
        
      case 'hours':
        return <BusinessHoursSection key={section.id} content={content} />;
        
      case 'gallery':
        return <BusinessGallerySection key={section.id} content={content} />;
        
      case 'testimonials':
        return <BusinessTestimonialsSection key={section.id} content={content} />;

      case 'booking':
        return <BusinessBookingTemplatesSection key={section.id} content={content} businessId={businessPage.business_id} />;
        
      case 'instagram':
        return <BusinessInstagramSection key={section.id} content={content} />;
        
      default:
        return (
          <div key={section.id} className="py-8">
            <h2 className="text-2xl font-bold mb-4 capitalize">{section.section_type}</h2>
            <p className="text-muted-foreground">
              This section type is not yet supported for display.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-16 py-8">
      {pageSections
        .sort((a, b) => a.section_order - b.section_order)
        .map(renderSection)}
    </div>
  );
};

export default BusinessPageSections;
