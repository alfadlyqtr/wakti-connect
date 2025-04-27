
import React, { useState, useEffect } from "react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import PoweredByWAKTI from "@/components/common/PoweredByWAKTI";
import BusinessPageNotFound from "./BusinessPageNotFound";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import PageBackground from "./PageBackground";
import SidebarSocialLinks from "./SidebarSocialLinks";
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
  const isAuthenticated = useAuthentication();
  const { redirectToLogin } = useAuthRedirect();
  
  console.log("BusinessLandingPage - authentication status:", isAuthenticated);
  console.log("BusinessLandingPage - businessPage:", businessPage);
  console.log("BusinessLandingPage - socialLinks:", socialLinks?.length || 0);
  console.log("BusinessLandingPage - social icons position:", businessPage?.social_icons_position);

  // Handle scroll effects for powered by
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
          
          {/* Main Content */}
          <BusinessPageContent 
            businessPage={businessPage}
            pageSections={pageSections || []}
            socialLinks={socialLinks}
            isPreviewMode={isPreviewMode}
            isAuthenticated={isAuthenticated}
          />

          {/* Powered by WAKTI */}
          {showPoweredBy && <PoweredByWAKTI />}
        </div>
      </PageBackground>
    </CurrencyProvider>
  );
};

export default BusinessLandingPageComponent;
