
import React from 'react';
import { BusinessPageSection } from '@/types/business.types';
import { cn } from '@/lib/utils';

// Define section components
import BusinessAboutSection from './sections/BusinessAboutSection';
import BusinessGallerySection from './sections/BusinessGallerySection';
import BusinessContactSection from './sections/BusinessContactSection';
import BusinessHoursSection from './sections/BusinessHoursSection';
import BusinessTestimonialsSection from './sections/BusinessTestimonialsSection';
import BusinessBookingSection from './sections/BusinessBookingSection';
import BusinessInstagramSection from './sections/BusinessInstagramSection';
import BusinessHeader from './BusinessHeader';

interface BusinessPageSectionsProps {
  sections: BusinessPageSection[];
  businessId: string;
  isPreviewMode?: boolean;
}

// Helper to get pattern CSS
const getPatternStyle = (pattern: string) => {
  switch (pattern) {
    case 'dots':
      return `
        background-image: radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      `;
    case 'lines':
      return `
        background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      `;
    case 'grid':
      return `
        background-image: 
          linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      `;
    case 'waves':
      return `
        background-image: repeating-radial-gradient(rgba(0, 0, 0, 0.1) 2px, transparent 3px, transparent 6px);
        background-size: 20px 20px;
      `;
    default:
      return '';
  }
};

// Helper to render section based on type
const renderSection = (
  section: BusinessPageSection, 
  businessId: string, 
  isPreviewMode?: boolean
) => {
  if (!section.is_visible) {
    return null;
  }

  // Apply section content styling
  const content = section.section_content || {};
  const sectionStyle: React.CSSProperties = {
    backgroundColor: content.backgroundColor || 'transparent',
    color: content.textColor || 'inherit',
    padding: content.padding || '2rem 0',
    borderRadius: content.borderRadius || '0',
  };

  // Add pattern if specified
  if (content.pattern && content.pattern !== 'none') {
    Object.assign(sectionStyle, {
      backgroundImage: '', // Will be set via className
      backgroundSize: '20px 20px',
      backgroundPosition: 'center',
      position: 'relative' as 'relative', // Type assertion to fix position type error
    });
  }

  // Add custom class for patterns
  const patternClass = content.pattern ? `pattern-${content.pattern}` : '';

  let sectionComponent;
  switch (section.section_type) {
    case 'header':
      return <BusinessHeader key={section.id} section={section} businessId={businessId} />;
    case 'about':
      sectionComponent = <BusinessAboutSection section={section} />;
      break;
    case 'gallery':
      sectionComponent = <BusinessGallerySection section={section} />;
      break;
    case 'contact':
      sectionComponent = <BusinessContactSection section={section} />;
      break;
    case 'hours':
      sectionComponent = <BusinessHoursSection section={section} />;
      break;
    case 'testimonials':
      sectionComponent = <BusinessTestimonialsSection section={section} />;
      break;
    case 'booking':
      sectionComponent = <BusinessBookingSection 
        section={section} 
        businessId={businessId} 
        isPreviewMode={isPreviewMode} 
      />;
      break;
    case 'instagram':
      sectionComponent = <BusinessInstagramSection section={section} />;
      break;
    default:
      return null;
  }

  return (
    <section 
      key={section.id} 
      style={sectionStyle}
      className={cn("w-full", patternClass)}
      data-section-id={section.id}
      data-section-type={section.section_type}
    >
      <div className="container mx-auto px-4">
        {sectionComponent}
      </div>
    </section>
  );
};

const BusinessPageSections: React.FC<BusinessPageSectionsProps> = ({ 
  sections, 
  businessId,
  isPreviewMode
}) => {
  // Sort sections by their order
  const sortedSections = [...sections].sort((a, b) => a.section_order - b.section_order);
  
  return (
    <div className="business-page-sections">
      <style jsx global>{`
        .pattern-dots {
          background-image: radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
        }
        .pattern-lines {
          background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
        }
        .pattern-grid {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
        }
        .pattern-waves {
          background-image: repeating-radial-gradient(rgba(0, 0, 0, 0.1) 2px, transparent 3px, transparent 6px);
        }
      `}</style>
      {sortedSections.map(section => renderSection(section, businessId, isPreviewMode))}
    </div>
  );
};

export default BusinessPageSections;
