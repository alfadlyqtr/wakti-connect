
import React, { useEffect, useState } from "react";
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from "@/types/business.types";
import BusinessPageHeader from "./BusinessPageHeader";
import BusinessPageSections from "./BusinessPageSections";
import SocialIconsGroup from "./SocialIconsGroup";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import { BusinessHours } from "@/hooks/useBusinessHours";

interface BusinessPageContentProps {
  businessPage: BusinessPage;
  pageSections: BusinessPageSection[];
  socialLinks: BusinessSocialLink[] | undefined;
  isPreviewMode: boolean;
  isAuthenticated: boolean | null;
  businessHours?: BusinessHours | null; // Add business hours prop
  displayStyle?: 'icons' | 'buttons'; // Add display style prop
}

const BusinessPageContent: React.FC<BusinessPageContentProps> = ({
  businessPage,
  pageSections,
  socialLinks,
  isPreviewMode,
  isAuthenticated,
  businessHours,
  displayStyle = 'icons'
}) => {
  // Use provided display style
  const [localDisplayStyle, setLocalDisplayStyle] = useState<'icons' | 'buttons'>(displayStyle);
  
  // Update display style when prop changes
  useEffect(() => {
    if (displayStyle) {
      setLocalDisplayStyle(displayStyle);
    }
  }, [displayStyle]);

  const {
    content_max_width = "1200px",
    social_icons_style = "default",
    social_icons_size = "default",
    social_icons_position = "footer",
  } = businessPage;

  const showHeaderSocialLinks = socialLinks && socialLinks.length > 0 && 
    ['header', 'both'].includes(social_icons_position || '');
  
  const showFooterSocialLinks = socialLinks && socialLinks.length > 0 && 
    ['footer', 'both'].includes(social_icons_position || '');

  return (
    <div
      style={{ maxWidth: content_max_width }}
      className="mx-auto px-4 sm:px-6"
    >
      {showHeaderSocialLinks && (
        <div className="pt-4 pb-2">
          <SocialIconsGroup 
            socialLinks={socialLinks || []}
            style={(social_icons_style as any) || "default"}
            size={(social_icons_size as any) || "default"}
            position="header"
            className="justify-end"
            displayStyle={localDisplayStyle}
          />
        </div>
      )}
      
      <BusinessPageHeader 
        business={{
          id: businessPage.business_id,
          business_name: businessPage.page_title,
          display_name: businessPage.page_title,
          account_type: "business",
          avatar_url: businessPage.logo_url
        }} 
        isPreviewMode={isPreviewMode}
        isAuthenticated={isAuthenticated}
      />
      
      <BusinessPageSections 
        pageSections={pageSections || []} 
        businessPage={businessPage}
        businessHoursId={businessPage.business_id}
        businessHours={businessHours} // Pass down the business hours
      />

      {showFooterSocialLinks && (
        <div className="mt-8 mb-4">
          <SocialIconsGroup 
            socialLinks={socialLinks || []}
            style={(social_icons_style as any) || "default"}
            size={(social_icons_size as any) || "default"}
            position="footer"
            className="pb-6"
            displayStyle={localDisplayStyle}
          />
        </div>
      )}
    </div>
  );
};

export default BusinessPageContent;
