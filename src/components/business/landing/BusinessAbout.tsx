
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import BusinessAboutSection from "./sections/BusinessAboutSection";

interface BusinessAboutProps {
  section: BusinessPageSection;
  businessId?: string;
  pageId?: string;
  submitContactForm?: (data: any) => Promise<any>;
  primaryColor?: string;
}

const BusinessAbout = ({ 
  section,
  businessId,
  pageId,
  submitContactForm,
  primaryColor 
}: BusinessAboutProps) => {
  const content = section.section_content || {};
  
  return (
    <BusinessAboutSection 
      content={content}
      businessId={businessId}
      pageId={pageId}
      primaryColor={primaryColor}
      submitContactForm={submitContactForm}
    />
  );
};

export default BusinessAbout;
