
import React, { useState, useEffect } from "react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import BusinessPageHeader from "./BusinessPageHeader";
import BusinessPageSections from "./BusinessPageSections";
import PoweredByWAKTI from "@/components/common/PoweredByWAKTI";
import BusinessPageNotFound from "./BusinessPageNotFound";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import SocialIconsGroup from "./SocialIconsGroup";
import FloatingSubscribeButton from "./FloatingSubscribeButton";
import { useAuthentication } from "@/hooks/useAuthentication";

interface BusinessLandingPageProps {
  slug: string;
  isPreviewMode?: boolean;
}

const BusinessLandingPageComponent: React.FC<BusinessLandingPageProps> = ({
  slug,
  isPreviewMode = false,
}) => {
  // Updated to match the new useBusinessPage API
  const { 
    businessPage, 
    isLoading, 
    pageSections,
    socialLinks
  } = useBusinessPage(slug);
  
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const [showSubscribeButton, setShowSubscribeButton] = useState(true);
  const isAuthenticated = useAuthentication();

  // Hide PoweredByWAKTI after scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowPoweredBy(false);
      } else {
        setShowPoweredBy(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!businessPage) {
    return <BusinessPageNotFound />;
  }

  // Get the business's style preferences
  const {
    primary_color,
    secondary_color,
    background_color,
    text_color,
    font_family,
    page_pattern,
    content_max_width = "1200px",
    social_icons_style = "default",
    social_icons_size = "default",
    social_icons_position = "footer",
    show_subscribe_button = true,
    subscribe_button_position = "floating",
  } = businessPage;

  // Set default background to white if not specified
  const bgColor = background_color || "#ffffff";

  // Create dynamic styles based on the business page settings
  const pageStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: text_color || "#1f2937",
    fontFamily: font_family || "inherit",
    backgroundImage: page_pattern
      ? `url(${page_pattern})`
      : "none",
    backgroundSize: "cover",
    backgroundRepeat: "repeat",
    backgroundPosition: "center",
  };

  // Check if subscribe button should be shown
  const handleAuthRequired = () => {
    // Open login modal or redirect to login page
    console.log("Auth required for subscription");
  };

  return (
    <CurrencyProvider initialCurrency={businessPage.business_id}>
      <div style={pageStyle} className="min-h-screen relative pb-10">
        <div
          style={{ maxWidth: content_max_width }}
          className="mx-auto px-4 sm:px-6"
        >
          <BusinessPageHeader 
            business={{
              id: businessPage.business_id,
              business_name: businessPage.page_title,
              display_name: businessPage.page_title,
              account_type: "business"
            }} 
          />
          <BusinessPageSections 
            pageSections={pageSections || []} 
            businessPage={businessPage} 
          />

          {/* Social Media Icons */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="mt-8 mb-4">
              <SocialIconsGroup 
                socialLinks={socialLinks}
                style={social_icons_style as any}
                size={social_icons_size as any}
                position={social_icons_position as any}
                className="pb-6"
              />
            </div>
          )}
        </div>

        {/* Floating Subscribe Button */}
        {show_subscribe_button && subscribe_button_position === "floating" && (
          <FloatingSubscribeButton 
            businessId={businessPage.business_id}
            visible={showSubscribeButton}
            showButton={show_subscribe_button}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
            backgroundColor={primary_color}
            textColor="#ffffff"
            customText={businessPage.subscribe_button_text || "Subscribe"}
          />
        )}

        {showPoweredBy && <PoweredByWAKTI />}
      </div>
    </CurrencyProvider>
  );
};

export default BusinessLandingPageComponent;
