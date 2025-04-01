
import React, { useState, useEffect } from "react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import PoweredByWAKTI from "@/components/common/PoweredByWAKTI";
import BusinessPageNotFound from "./BusinessPageNotFound";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import PageBackground from "./PageBackground";
import SidebarSocialLinks from "./SidebarSocialLinks";
import FloatingSubscribeButton from "./FloatingSubscribeButton";
import ThemeColorApplier from "./ThemeColorApplier";
import BusinessPageContent from "./BusinessPageContent";

interface BusinessLandingPageProps {
  slug: string;
  isPreviewMode?: boolean;
}

const BusinessLandingPageComponent: React.FC<BusinessLandingPageProps> = ({
  slug,
  isPreviewMode = false,
}) => {
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
  
  const { isSubscribed, checkingSubscription, subscribe, unsubscribe } = 
    useBusinessSubscribers(businessPage?.business_id);

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

  // Handle scroll effects for powered by and floating button
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

  // Apply theme colors
  ThemeColorApplier({ businessPage });

  // Handle authentication required action
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

  const bgColor = businessPage.background_color || "#ffffff";
  const showSidebarSocialLinks = socialLinks && socialLinks.length > 0 && 
    ['sidebar'].includes(businessPage.social_icons_position || '');
  const showFloatingSubscribeBtn = businessPage.show_subscribe_button && 
    ['floating', 'both'].includes(businessPage.subscribe_button_position || '');

  return (
    <CurrencyProvider initialCurrency={businessPage.business_id}>
      <PageBackground
        bgColor={bgColor}
        pagePattern={businessPage.page_pattern}
        textColor={businessPage.text_color}
        fontFamily={businessPage.font_family}
      >
        <div className="relative min-h-screen">
          {/* Sidebar Social Links */}
          {showSidebarSocialLinks && (
            <SidebarSocialLinks
              socialLinks={socialLinks || []}
              style={(businessPage.social_icons_style as any) || "default"}
              size={(businessPage.social_icons_size as any) || "default"}
              position="sidebar"
            />
          )}
          
          {/* Floating Subscribe Button */}
          {showFloatingSubscribeBtn && (
            <FloatingSubscribeButton 
              businessId={businessPage.business_id}
              visible={showFloatingButton}
              showButton={businessPage.show_subscribe_button}
              isAuthenticated={isAuthenticated}
              onAuthRequired={handleAuthRequired}
              backgroundColor={businessPage.primary_color}
              textColor="#FFFFFF"
              borderRadius="0.5rem"
              gradientFrom={businessPage.primary_color}
              gradientTo={businessPage.secondary_color}
              customText={businessPage.subscribe_button_text || "Subscribe"}
            />
          )}
          
          {/* Main Content */}
          <BusinessPageContent 
            businessPage={businessPage}
            pageSections={pageSections || []}
            socialLinks={socialLinks}
            isPreviewMode={isPreviewMode}
            isAuthenticated={isAuthenticated}
            isSubscribed={isSubscribed}
            checkingSubscription={checkingSubscription}
            subscribe={subscribe}
            unsubscribe={unsubscribe}
            handleAuthRequired={handleAuthRequired}
          />

          {/* Powered by WAKTI */}
          {showPoweredBy && <PoweredByWAKTI />}
        </div>
      </PageBackground>
    </CurrencyProvider>
  );
};

export default BusinessLandingPageComponent;
