
import React from 'react';
import { BusinessPageSection, BusinessPage } from '@/types/business.types';
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
  businessPage: BusinessPage;
  isPreviewMode?: boolean;
}

// Helper to render section based on type
const renderSection = (
  section: BusinessPageSection, 
  businessId: string,
  businessPage: BusinessPage,
  isPreviewMode?: boolean
) => {
  if (!section.is_visible) {
    return null;
  }

  // Apply section content styling
  const content = section.section_content || {};
  
  // Get section-specific styling values, falling back to the section.section_content, 
  // then to section field directly, and finally to default values
  const backgroundColor = section.background_color || content.backgroundColor || 'transparent';
  const textColor = section.text_color || content.textColor || 'inherit';
  const padding = section.padding || content.padding || '2rem 0';
  const borderRadius = section.border_radius || content.borderRadius || '0';
  const backgroundImageUrl = section.background_image_url || content.backgroundImageUrl || '';
  
  // Convert padding shorthand to actual value
  const paddingValue = (() => {
    switch (padding) {
      case 'none': return '0';
      case 'sm': return '1rem 0';
      case 'md': return '2rem 0';
      case 'lg': return '3rem 0';
      case 'xl': return '4rem 0';
      default: return padding;
    }
  })();
  
  // Convert borderRadius shorthand to actual value
  const borderRadiusValue = (() => {
    switch (borderRadius) {
      case 'none': return '0px';
      case 'small': return '4px';
      case 'medium': return '8px';
      case 'large': return '12px';
      case 'full': return '9999px';
      default: return borderRadius;
    }
  })();
  
  const sectionStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding: paddingValue,
    borderRadius: borderRadiusValue,
    position: 'relative',
  };
  
  // Add background image if provided
  if (backgroundImageUrl) {
    sectionStyle.backgroundImage = `url(${backgroundImageUrl})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }

  // Add custom class for patterns
  const patternClass = content.pattern ? `pattern-${content.pattern}` : '';

  let sectionComponent;
  switch (section.section_type) {
    case 'header':
      return <BusinessHeader key={section.id} section={section} businessPage={businessPage} />;
    case 'about':
      sectionComponent = <BusinessAboutSection content={section.section_content} />;
      break;
    case 'gallery':
      sectionComponent = <BusinessGallerySection content={section.section_content} />;
      break;
    case 'contact':
      sectionComponent = <BusinessContactSection 
        content={section.section_content} 
        businessId={businessId}
      />;
      break;
    case 'hours':
      sectionComponent = <BusinessHoursSection content={section.section_content} />;
      break;
    case 'testimonials':
      sectionComponent = <BusinessTestimonialsSection content={section.section_content} />;
      break;
    case 'booking':
      sectionComponent = <BusinessBookingSection 
        content={section.section_content || {}} 
        businessId={businessId}
      />;
      break;
    case 'instagram':
      sectionComponent = <BusinessInstagramSection content={section.section_content} />;
      break;
    default:
      return null;
  }

  return (
    <section 
      key={section.id} 
      style={sectionStyle}
      className={cn("w-full section-container", patternClass)}
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
  businessPage,
  isPreviewMode
}) => {
  // Sort sections by their order
  const sortedSections = [...sections].sort((a, b) => a.section_order - b.section_order);
  
  return (
    <div className="business-page-sections">
      <style>
        {`
          .pattern-dots {
            background-image: radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .pattern-lines {
            background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .pattern-grid {
            background-image: 
              linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .pattern-waves {
            background-image: repeating-radial-gradient(rgba(0, 0, 0, 0.1) 2px, transparent 3px, transparent 6px);
            background-size: 20px 20px;
          }
          
          /* Add spacing between sections */
          .section-container + .section-container {
            margin-top: 1rem;
          }
          
          /* Enhanced pattern styling */
          .pattern-dots.section-container {
            background-blend-mode: overlay;
          }
          .pattern-lines.section-container {
            background-blend-mode: overlay;
          }
          .pattern-grid.section-container {
            background-blend-mode: overlay;
          }
          .pattern-waves.section-container {
            background-blend-mode: overlay;
          }
        `}
      </style>
      {sortedSections.map(section => renderSection(section, businessId, businessPage, isPreviewMode))}
    </div>
  );
};

export default BusinessPageSections;
