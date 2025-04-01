
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
  } = useBusinessPage(slug, isPreviewMode);
  
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const [showSubscribeButton, setShowSubscribeButton] = useState(true);
  const isAuthenticated = useAuthentication();

  console.log("BusinessLandingPage - businessPage:", businessPage);
  console.log("BusinessLandingPage - socialLinks:", socialLinks?.length || 0);
  console.log("BusinessLandingPage - social icons position:", businessPage?.social_icons_position);
  console.log("BusinessLandingPage - show subscribe button:", businessPage?.show_subscribe_button);

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

  // Apply theme colors from business page settings
  useEffect(() => {
    if (businessPage) {
      console.log("Applying theme colors:", {
        primary: businessPage.primary_color,
        secondary: businessPage.secondary_color
      });
      
      if (businessPage.primary_color) {
        // Set primary color as CSS variable
        document.documentElement.style.setProperty('--primary', businessPage.primary_color);
        // Also set the RGB version for Tailwind compatibility
        document.documentElement.style.setProperty('--primary-rgb', hexToRGB(businessPage.primary_color));
      }
      
      if (businessPage.secondary_color) {
        // Set secondary color as CSS variable
        document.documentElement.style.setProperty('--secondary', businessPage.secondary_color);
        // Also set the RGB version for Tailwind compatibility
        document.documentElement.style.setProperty('--secondary-rgb', hexToRGB(businessPage.secondary_color));
      }
    }
    
    return () => {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-rgb');
      document.documentElement.style.removeProperty('--secondary');
      document.documentElement.style.removeProperty('--secondary-rgb');
    };
  }, [businessPage]);

  // Helper function to convert HEX to RGB for CSS variables
  function hexToRGB(hex: string): string {
    if (!hex || !hex.startsWith('#')) return '0, 0, 0';
    
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values to get r, g, b
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Return RGB value as comma-separated string
    return `${r}, ${g}, ${b}`;
  }

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
    logo_url
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

  // Check if auth required for subscription
  const handleAuthRequired = () => {
    // Open login modal or redirect to login page
    console.log("Auth required for subscription");
  };

  // Check if social links should be shown in their respective positions
  const showHeaderSocialLinks = socialLinks && socialLinks.length > 0 && 
    ['header', 'both'].includes(social_icons_position || '');
  
  const showFooterSocialLinks = socialLinks && socialLinks.length > 0 && 
    ['footer', 'both'].includes(social_icons_position || '');
    
  const showSidebarSocialLinks = socialLinks && socialLinks.length > 0 && 
    ['sidebar'].includes(social_icons_position || '');

  console.log("Show header social links:", showHeaderSocialLinks);
  console.log("Show footer social links:", showFooterSocialLinks);
  console.log("Show sidebar social links:", showSidebarSocialLinks);

  return (
    <CurrencyProvider initialCurrency={businessPage.business_id}>
      <div style={pageStyle} className="min-h-screen relative pb-10">
        {/* Sidebar Social Icons - Fixed position for both mobile and desktop */}
        {showSidebarSocialLinks && (
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30 hidden md:block">
            <SocialIconsGroup 
              socialLinks={socialLinks || []}
              style={(social_icons_style as any) || "default"}
              size={(social_icons_size as any) || "default"}
              position="sidebar"
              vertical={true}
            />
          </div>
        )}
        
        {/* Mobile Sidebar Social Icons - Show on smaller screens */}
        {showSidebarSocialLinks && (
          <div className="fixed left-2 top-1/2 transform -translate-y-1/2 z-30 block md:hidden">
            <SocialIconsGroup 
              socialLinks={socialLinks || []}
              style={(social_icons_style as any) || "default"}
              size="small" /* Smaller size for mobile */
              position="sidebar"
              vertical={true}
              scale={0.8} /* Slightly smaller for mobile */
            />
          </div>
        )}
        
        <div
          style={{ maxWidth: content_max_width }}
          className="mx-auto px-4 sm:px-6"
        >
          {/* Add social media icons in header if position is set to "header" or "both" */}
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
              avatar_url: logo_url  // Pass logo URL to header
            }} 
            isPreviewMode={isPreviewMode}
            isAuthenticated={isAuthenticated}
          />
          
          <BusinessPageSections 
            pageSections={pageSections || []} 
            businessPage={businessPage} 
          />

          {/* Social Media Icons in footer */}
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

        {/* Floating Subscribe Button - Show based on page settings */}
        {show_subscribe_button && (
          <FloatingSubscribeButton 
            businessId={businessPage.business_id}
            visible={showSubscribeButton}
            showButton={true} /* Force to true to ensure visibility */
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
