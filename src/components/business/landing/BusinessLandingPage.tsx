
import React, { useState, useEffect } from "react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import BusinessPageHeader from "./BusinessPageHeader";
import BusinessPageSections from "./BusinessPageSections";
import PoweredByWAKTI from "@/components/common/PoweredByWAKTI";
import BusinessPageNotFound from "./BusinessPageNotFound";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import SocialIconsGroup from "./SocialIconsGroup";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import FloatingSubscribeButton from "./FloatingSubscribeButton";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useTMWChatbot } from "@/hooks/useTMWChatbot";

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
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const isAuthenticated = useAuthentication();
  const { redirectToLogin } = useAuthRedirect();
  
  // Get subscription info for the business
  const { isSubscribed, checkingSubscription, subscribe, unsubscribe } = 
    useBusinessSubscribers(businessPage?.business_id);

  // Initialize the TMW Chatbot hook
  useTMWChatbot(businessPage?.chatbot_enabled, businessPage?.chatbot_code);

  // Debug logs to identify issues
  console.log("BusinessLandingPage - authentication status:", isAuthenticated);
  console.log("BusinessLandingPage - businessPage:", businessPage);
  console.log("BusinessLandingPage - socialLinks:", socialLinks?.length || 0);
  console.log("BusinessLandingPage - social icons position:", businessPage?.social_icons_position);
  console.log("BusinessLandingPage - subscription status:", isSubscribed);
  console.log("BusinessLandingPage - subscribe button settings:", {
    show: businessPage?.show_subscribe_button,
    position: businessPage?.subscribe_button_position,
    text: businessPage?.subscribe_button_text
  });
  console.log("BusinessLandingPage - TMW chatbot settings:", {
    enabled: businessPage?.chatbot_enabled,
    hasCode: !!businessPage?.chatbot_code
  });

  // Handle scroll to show/hide the floating button and PoweredByWAKTI component
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowPoweredBy(false);
        setShowFloatingButton(true);
      } else {
        setShowPoweredBy(true);
        setShowFloatingButton(false);
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

  // Handler for when auth is required
  const handleAuthRequired = () => {
    redirectToLogin(`/business/${slug}`);
  };

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
    logo_url,
    show_subscribe_button = true,
    subscribe_button_text = "Subscribe",
    subscribe_button_position = "both"
  } = businessPage;

  // Set default background to white if not specified
  const bgColor = background_color || "#ffffff";

  // Check if the background pattern is a data URL (custom image)
  const isCustomBgImage = page_pattern && page_pattern.startsWith('data:');

  // Create dynamic styles based on the business page settings
  const pageStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: text_color || "#1f2937",
    fontFamily: font_family || "inherit",
    backgroundImage: isCustomBgImage 
      ? `url(${page_pattern})`
      : getBackgroundPattern(page_pattern),
    backgroundSize: isCustomBgImage ? "cover" : "auto",
    backgroundRepeat: isCustomBgImage ? "no-repeat" : "repeat",
    backgroundPosition: "center",
  };

  // Generate pattern CSS
  function getBackgroundPattern(pattern?: string): string {
    if (!pattern || pattern === 'none') return "none";
    
    switch (pattern) {
      case 'dots':
        return 'radial-gradient(#00000022 1px, transparent 1px)';
      case 'grid':
        return 'linear-gradient(to right, #00000011 1px, transparent 1px), linear-gradient(to bottom, #00000011 1px, transparent 1px)';
      case 'waves':
        return 'url("data:image/svg+xml,%3Csvg width="100" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 10 C 30 0, 70 0, 100 10 L 100 20 L 0 20 Z" fill="%2300000011"/%3E%3C/svg%3E")';
      case 'diagonal':
        return 'repeating-linear-gradient(45deg, #00000011, #00000011 1px, transparent 1px, transparent 10px)';
      case 'circles':
        return 'radial-gradient(circle, #00000011 10px, transparent 11px)';
      case 'triangles':
        return 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0 L 30 52 L 60 0 Z" fill="%2300000011"/%3E%3C/svg%3E")';
      case 'hexagons':
        return 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 15 L 15 0 L 45 0 L 60 15 L 60 45 L 45 60 L 15 60 L 0 45 Z" fill="%2300000011"/%3E%3C/svg%3E")';
      case 'stripes':
        return 'repeating-linear-gradient(90deg, #00000011, #00000011 5px, transparent 5px, transparent 15px)';
      case 'zigzag':
        return 'linear-gradient(135deg, #00000011 25%, transparent 25%) 0 0, linear-gradient(225deg, #00000011 25%, transparent 25%) 0 0';
      case 'confetti':
        return 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Crect x="10" y="10" width="4" height="4" transform="rotate(45 12 12)" fill="%2300000022"/%3E%3Crect x="30" y="20" width="4" height="4" transform="rotate(30 32 22)" fill="%2300000022"/%3E%3Crect x="15" y="40" width="4" height="4" transform="rotate(60 17 42)" fill="%2300000022"/%3E%3Crect x="40" y="45" width="4" height="4" transform="rotate(12 42 47)" fill="%2300000022"/%3E%3C/svg%3E")';
      case 'bubbles':
        return 'radial-gradient(circle at 25px 25px, #00000011 15px, transparent 16px), radial-gradient(circle at 75px 75px, #00000011 15px, transparent 16px)';
      case 'noise':
        return 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.15"/%3E%3C/svg%3E")';
      case 'paper':
        return 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="paperFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5"/%3E%3CfeDisplacementMap in="SourceGraphic" scale="10"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23paperFilter)" opacity="0.1"/%3E%3C/svg%3E")';
      default:
        return 'none';
    }
  }

  // Check if social links should be shown in their respective positions
  const showHeaderSocialLinks = socialLinks && socialLinks.length > 0 && 
    ['header', 'both'].includes(social_icons_position || '');
  
  const showFooterSocialLinks = socialLinks && socialLinks.length > 0 && 
    ['footer', 'both'].includes(social_icons_position || '');
    
  const showSidebarSocialLinks = socialLinks && socialLinks.length > 0 && 
    ['sidebar'].includes(social_icons_position || '');

  // Check if floating subscribe button should be shown
  const showFloatingSubscribeBtn = show_subscribe_button && 
    ['floating', 'both'].includes(subscribe_button_position || '');

  console.log("Show header social links:", showHeaderSocialLinks);
  console.log("Show footer social links:", showFooterSocialLinks);
  console.log("Show sidebar social links:", showSidebarSocialLinks);
  console.log("Show floating subscribe button:", showFloatingSubscribeBtn);

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
        
        {/* Floating subscribe button */}
        {showFloatingSubscribeBtn && (
          <FloatingSubscribeButton 
            businessId={businessPage.business_id}
            visible={showFloatingButton}
            showButton={show_subscribe_button}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
            backgroundColor={primary_color}
            textColor="#FFFFFF"
            borderRadius="0.5rem"
            gradientFrom={primary_color}
            gradientTo={secondary_color}
            customText={subscribe_button_text || "Subscribe"}
          />
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
            isSubscribed={isSubscribed}
            checkingSubscription={checkingSubscription}
            subscribe={subscribe}
            unsubscribe={unsubscribe}
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

        {showPoweredBy && <PoweredByWAKTI />}
      </div>
    </CurrencyProvider>
  );
};

export default BusinessLandingPageComponent;
