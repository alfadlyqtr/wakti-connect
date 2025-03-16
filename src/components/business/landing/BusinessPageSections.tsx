
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import BusinessHeader from "./BusinessHeader";
import BusinessAbout from "./BusinessAbout";
import BusinessServicesList from "./BusinessServicesList";
import BusinessContactInfo from "./BusinessContactInfo";
import BusinessGallery from "./BusinessGallery";
import BusinessHours from "./BusinessHours";
import BusinessTestimonials from "./BusinessTestimonials";

interface BusinessPageSectionsProps {
  pageSections: BusinessPageSection[];
  businessPage: any;
}

const BusinessPageSections: React.FC<BusinessPageSectionsProps> = ({ 
  pageSections, 
  businessPage 
}) => {
  const renderSection = (section: BusinessPageSection) => {
    if (!section.is_visible) return null;
    
    switch (section.section_type) {
      case 'header':
        return businessPage ? (
          <BusinessHeader key={section.id} section={section} businessPage={businessPage} />
        ) : null;
      
      case 'about':
        return <BusinessAbout key={section.id} section={section} />;
      
      case 'services':
        return <BusinessServicesList key={section.id} section={section} businessId={businessPage?.business_id} />;
      
      case 'contact':
        return <BusinessContactInfo key={section.id} section={section} />;
      
      case 'gallery':
        return <BusinessGallery key={section.id} section={section} />;
      
      case 'hours':
        return <BusinessHours key={section.id} section={section} />;
      
      case 'testimonials':
        return <BusinessTestimonials key={section.id} section={section} />;
      
      default:
        return (
          <div key={section.id} className="py-6">
            <p className="text-muted-foreground text-center">Unknown section type</p>
          </div>
        );
    }
  };

  if (!pageSections || pageSections.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {businessPage.page_title}
        </h1>
        {businessPage.description && (
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {businessPage.description}
          </p>
        )}
      </div>
    );
  }
  
  return (
    <>
      {pageSections
        .sort((a, b) => a.section_order - b.section_order)
        .map(renderSection)
      }
    </>
  );
};

export default BusinessPageSections;
