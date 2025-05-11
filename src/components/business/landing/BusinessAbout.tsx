
import React from "react";
import { BusinessPageSection, BusinessSocialLink } from "@/types/business.types";
import BusinessAboutSection from "./sections/BusinessAboutSection";

interface BusinessAboutProps {
  section: BusinessPageSection;
  businessId?: string;
  pageId?: string;
  submitContactForm?: (data: any) => Promise<any>;
  primaryColor?: string;
  socialLinks?: BusinessSocialLink[];
  businessProfile?: any; // Include the business profile for additional information
}

const BusinessAbout = ({ 
  section,
  businessId,
  pageId,
  submitContactForm,
  primaryColor,
  socialLinks,
  businessProfile
}: BusinessAboutProps) => {
  const content = section.section_content || {};
  
  // Log social links for debugging
  console.log("BusinessAbout component received socialLinks:", socialLinks);
  
  return (
    <BusinessAboutSection 
      content={content}
      businessId={businessId}
      pageId={pageId}
      primaryColor={primaryColor}
      submitContactForm={submitContactForm}
      socialLinks={socialLinks}
      businessProfile={businessProfile}
    />
  );
};

export default BusinessAbout;
