
import React, { useEffect, useState } from "react";
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from "@/types/business.types";
import BusinessPageHeader from "./BusinessPageHeader";
import BusinessPageSections from "./BusinessPageSections";
import SocialIconsGroup from "./SocialIconsGroup";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";

interface BusinessPageContentProps {
  businessPage: BusinessPage;
  pageSections: BusinessPageSection[];
  socialLinks: BusinessSocialLink[] | undefined;
  isPreviewMode: boolean;
  isAuthenticated: boolean | null;
}

const BusinessPageContent: React.FC<BusinessPageContentProps> = ({
  businessPage,
  pageSections,
  socialLinks,
  isPreviewMode,
  isAuthenticated
}) => {
  const [displayStyle, setDisplayStyle] = useState<'icons' | 'buttons'>('icons');
  const { socialSettings } = useBusinessSocialLinks(businessPage.business_id);

  // Update display style based on settings
  useEffect(() => {
    if (socialSettings) {
      setDisplayStyle(socialSettings.display_style);
    }
  }, [socialSettings]);

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
            displayStyle={displayStyle}
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
        businessHoursId={businessPage.business_id} // Pass the business ID for hours
      />

      {showFooterSocialLinks && (
        <div className="mt-8 mb-4">
          <SocialIconsGroup 
            socialLinks={socialLinks || []}
            style={(social_icons_style as any) || "default"}
            size={(social_icons_size as any) || "default"}
            position="footer"
            className="pb-6"
            displayStyle={displayStyle}
          />
        </div>
      )}
    </div>
  );
};

export default BusinessPageContent;
