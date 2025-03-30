
import React, { useEffect, useState } from "react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BusinessSocialLinks from "./BusinessSocialLinks";
import BusinessPageSections from "./BusinessPageSections";
import BusinessPageNotFound from "./BusinessPageNotFound";
import { BusinessProfile } from "@/types/business.types";
import PoweredByWAKTI from "./PoweredByWAKTI";
import BusinessSubscribeButton from "./BusinessSubscribeButton";
import AuthenticationAlert from "./AuthenticationAlert";
import FloatingSubscribeButton from "./FloatingSubscribeButton";
import { useTMWChatbot } from "@/hooks/useTMWChatbot";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

interface BusinessLandingPageComponentProps {
  slug?: string;
  isPreviewMode?: boolean;
}

const BusinessLandingPageComponent: React.FC<BusinessLandingPageComponentProps> = ({ 
  slug, 
  isPreviewMode = false 
}) => {
  const { businessPage, pageSections, socialLinks, isLoading } = useBusinessPage(slug);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const chatbotScriptRef = useTMWChatbot(businessPage?.chatbot_enabled, businessPage?.chatbot_code);
  const isMobile = useIsMobile();
  
  const [showFloatingSubscribe, setShowFloatingSubscribe] = useState(false);
  
  useEffect(() => {
    if (isPreviewMode) {
      setIsAuthenticated(false);
      return;
    }
    
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
    };
    
    checkAuth();
  }, [isPreviewMode]);
  
  useEffect(() => {
    if (!businessPage?.show_subscribe_button) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowFloatingSubscribe(scrollPosition > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [businessPage?.show_subscribe_button]);
  
  const handleTrySubscribe = () => {
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return false;
    }
    return true;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!businessPage) {
    return <BusinessPageNotFound />;
  }

  const businessProfile: BusinessProfile = {
    id: businessPage.business_id,
    business_name: businessPage.page_title || "Business",
    account_type: "business"
  };
  
  const showSubscribeButton = !isPreviewMode && businessPage.show_subscribe_button !== false;
  
  const primaryColor = businessPage.primary_color || '#7C3AED';
  const secondaryColor = businessPage.secondary_color || '#8B5CF6';
  const textColor = businessPage.text_color || '#ffffff';
  const fontFamily = businessPage.font_family || 'sans-serif';
  const borderRadius = businessPage.border_radius || 'medium';
  const borderRadiusValue = 
    borderRadius === 'none' ? '0px' :
    borderRadius === 'small' ? '4px' :
    borderRadius === 'medium' ? '8px' :
    borderRadius === 'large' ? '12px' :
    borderRadius === 'full' ? '9999px' : '8px';
  
  // Generate background pattern
  const backgroundPattern = businessPage.page_pattern 
    ? businessPage.page_pattern === 'dots' 
      ? 'radial-gradient(#00000022 1px, transparent 1px)'
      : businessPage.page_pattern === 'grid' 
        ? 'linear-gradient(to right, #00000011 1px, transparent 1px), linear-gradient(to bottom, #00000011 1px, transparent 1px)'
        : businessPage.page_pattern === 'waves' 
          ? 'url("data:image/svg+xml,%3Csvg width="100" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 10 C 30 0, 70 0, 100 10 L 100 20 L 0 20 Z" fill="%2300000011"/%3E%3C/svg%3E")'
          : businessPage.page_pattern === 'diagonal' 
            ? 'repeating-linear-gradient(45deg, #00000011, #00000011 1px, transparent 1px, transparent 10px)'
            : 'none'
    : 'none';
  
  const backgroundSize = 
    businessPage.page_pattern === 'dots' ? '20px 20px' :
    businessPage.page_pattern === 'grid' ? '20px 20px' :
    businessPage.page_pattern === 'waves' ? '100px 20px' :
    businessPage.page_pattern === 'diagonal' ? '14px 14px' : 'auto';
  
  const subscribeButtonStyle = {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    color: textColor,
    borderRadius: borderRadiusValue,
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  };
  
  return (
    <div 
      className={`flex flex-col min-h-screen font-${fontFamily}`}
      style={{ 
        backgroundImage: backgroundPattern,
        backgroundSize: backgroundSize
      }}
    >
      <PoweredByWAKTI position="top" />
      
      <div 
        style={{
          '--primary-color': primaryColor,
          '--secondary-color': secondaryColor,
          '--text-color': textColor,
        } as React.CSSProperties}
        className="flex-1"
      >
        <AuthenticationAlert 
          visible={showAuthAlert} 
          onDismiss={() => setShowAuthAlert(false)} 
        />
        
        <div className="container mx-auto px-4 py-4">
          {showSubscribeButton && (
            <div className="mb-8 flex justify-center">
              {isAuthenticated ? (
                <BusinessSubscribeButton 
                  businessId={businessPage.business_id}
                  customText={businessPage.subscribe_button_text || "Subscribe"}
                  buttonStyle={subscribeButtonStyle}
                  size={isMobile ? "default" : "lg"}
                  className={cn(
                    "font-semibold text-white hover:opacity-90 shadow-md transition-all",
                    "animate-fade-in flex items-center gap-2"
                  )}
                />
              ) : (
                <BusinessSubscribeButton 
                  businessId={businessPage.business_id}
                  customText={businessPage.subscribe_button_text || "Subscribe"}
                  buttonStyle={subscribeButtonStyle}
                  size={isMobile ? "default" : "lg"}
                  className={cn(
                    "font-semibold text-white hover:opacity-90 shadow-md transition-all",
                    "animate-fade-in flex items-center gap-2"
                  )}
                  onAuthRequired={handleTrySubscribe}
                />
              )}
            </div>
          )}
          
          <BusinessPageSections 
            pageSections={pageSections} 
            businessPage={businessPage} 
          />
          
          {socialLinks && socialLinks.length > 0 && (
            <div className="mt-12 pt-6 border-t">
              <BusinessSocialLinks socialLinks={socialLinks} />
            </div>
          )}
        </div>
      </div>
      
      <FloatingSubscribeButton 
        businessId={businessPage.business_id}
        visible={showFloatingSubscribe}
        showButton={showSubscribeButton}
        isAuthenticated={isAuthenticated}
        onAuthRequired={handleTrySubscribe}
        buttonStyle={subscribeButtonStyle}
      />
      
      <PoweredByWAKTI position="bottom" />
    </div>
  );
};

export default BusinessLandingPageComponent;
