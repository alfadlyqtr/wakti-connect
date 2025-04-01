
import React from "react";
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from "@/types/business.types";
import BusinessPageHeader from "./BusinessPageHeader";
import BusinessPageSections from "./BusinessPageSections";
import SocialIconsGroup from "./SocialIconsGroup";

interface BusinessPageContentProps {
  businessPage: BusinessPage;
  pageSections: BusinessPageSection[];
  socialLinks: BusinessSocialLink[] | undefined;
  isPreviewMode: boolean;
  isAuthenticated: boolean | null;
  isSubscribed: boolean | undefined;
  checkingSubscription: boolean | undefined;
  subscribe: any;
  unsubscribe: any;
  handleAuthRequired: () => void;
}

const BusinessPageContent: React.FC<BusinessPageContentProps> = ({
  businessPage,
  pageSections,
  socialLinks,
  isPreviewMode,
  isAuthenticated,
  isSubscribed,
  checkingSubscription,
  subscribe,
  unsubscribe,
  handleAuthRequired
}) => {
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
        isSubscribed={isSubscribed}
        checkingSubscription={checkingSubscription}
        subscribe={subscribe}
        unsubscribe={unsubscribe}
      />
      
      <BusinessPageSections 
        pageSections={pageSections || []} 
        businessPage={businessPage} 
      />

      {showFooterSocialLinks && (
        <div className="mt-8 mb-4">
          <SocialIconsGroup 
            socialLinks={socialLinks || []}
            style={(social_icons_style as any) || "default"}
            size={(social_icons_size as any) || "default"}
            position="footer"
            className="pb-6"
          />
        </div>
      )}
    </div>
  );
};

export default BusinessPageContent;
