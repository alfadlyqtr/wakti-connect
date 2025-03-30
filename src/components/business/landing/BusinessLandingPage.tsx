
import React, { useEffect, useState } from "react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
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
  
  // Apply customization options
  const showSubscribeButton = !isPreviewMode && businessPage.show_subscribe_button !== false;
  const subscribeBtnPosition = businessPage.subscribe_button_position || 'both';
  const showTopSubscribeBtn = showSubscribeButton && (subscribeBtnPosition === 'top' || subscribeBtnPosition === 'both');
  const enableFloatingBtn = showSubscribeButton && (subscribeBtnPosition === 'floating' || subscribeBtnPosition === 'both');
  
  // Style variables
  const primaryColor = businessPage.primary_color || '#7C3AED';
  const secondaryColor = businessPage.secondary_color || '#8B5CF6';
  const textColor = businessPage.text_color || '#ffffff';
  const backgroundColor = businessPage.background_color || '#ffffff';
  const fontFamily = businessPage.font_family || 'sans-serif';
  const borderRadius = businessPage.border_radius || 'medium';
  const contentMaxWidth = businessPage.content_max_width || '1200px';
  const sectionSpacing = businessPage.section_spacing || 'default';
  
  // Calculate spacing based on setting
  const sectionGap = 
    sectionSpacing === 'compact' ? 'space-y-8' :
    sectionSpacing === 'spacious' ? 'space-y-24' : 'space-y-16';
  
  const borderRadiusValue = 
    borderRadius === 'none' ? '0px' :
    borderRadius === 'small' ? '4px' :
    borderRadius === 'medium' ? '8px' :
    borderRadius === 'large' ? '12px' :
    borderRadius === 'full' ? '9999px' : '8px';
  
  // Generate CSS classes for background pattern
  const patternClass = businessPage.page_pattern
    ? `pattern-${businessPage.page_pattern}`
    : '';
  
  // Button styling based on settings
  const subscribeButtonSize = businessPage.subscribe_button_size || 'default';
  const subscribeButtonStyle = businessPage.subscribe_button_style || 'gradient';
  
  const buttonStyleConfig = {
    background: subscribeButtonStyle === 'gradient' 
      ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
      : subscribeButtonStyle === 'outline' ? 'transparent' 
      : subscribeButtonStyle === 'minimal' ? 'transparent'
      : primaryColor,
    color: subscribeButtonStyle === 'outline' || subscribeButtonStyle === 'minimal' 
      ? primaryColor 
      : textColor,
    borderRadius: borderRadiusValue,
    boxShadow: subscribeButtonStyle === 'minimal' ? 'none' : '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
    border: subscribeButtonStyle === 'outline' ? `2px solid ${primaryColor}` : 'none',
    transition: 'all 0.3s ease',
  };
  
  // Social media styling
  const socialIconsStyle = businessPage.social_icons_style || 'default';
  const socialIconsSize = businessPage.social_icons_size || 'default';
  const socialIconsPosition = businessPage.social_icons_position || 'footer';
  
  return (
    <div 
      className={cn(
        `flex flex-col min-h-screen font-${fontFamily}`,
        patternClass
      )}
      style={{ 
        backgroundColor: backgroundColor,
      }}
    >
      <PoweredByWAKTI position="top" />
      
      {/* Social icons in header position if selected */}
      {socialIconsPosition === 'header' && socialLinks && socialLinks.length > 0 && (
        <div className="py-4 border-b">
          <div className="container mx-auto px-4">
            <BusinessSocialLinks 
              socialLinks={socialLinks} 
              iconsStyle={socialIconsStyle} 
              size={socialIconsSize} 
            />
          </div>
        </div>
      )}
      
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
        
        <div 
          className="mx-auto px-4 py-4" 
          style={{ maxWidth: contentMaxWidth }}
        >
          {showTopSubscribeBtn && (
            <div className="mb-8 flex justify-center">
              <BusinessSubscribeButton 
                businessId={businessPage.business_id}
                customText={businessPage.subscribe_button_text || "Subscribe"}
                buttonStyle={buttonStyleConfig}
                size={subscribeButtonSize === 'small' ? "sm" : subscribeButtonSize === 'large' ? "lg" : "default"}
                className={cn(
                  "font-semibold hover:opacity-90 transition-all",
                  "animate-fade-in flex items-center gap-2"
                )}
                onAuthRequired={handleTrySubscribe}
              />
            </div>
          )}
          
          <div className={sectionGap}>
            <BusinessPageSections 
              sections={pageSections}
              businessId={businessPage.business_id}
              businessPage={businessPage}
              isPreviewMode={isPreviewMode}
            />
          </div>
          
          {/* Social icons in footer position if selected */}
          {socialLinks && socialLinks.length > 0 && socialIconsPosition === 'footer' && (
            <div className="mt-12 pt-6 border-t">
              <BusinessSocialLinks 
                socialLinks={socialLinks} 
                iconsStyle={socialIconsStyle} 
                size={socialIconsSize}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Social icons in sidebar position if selected */}
      {socialIconsPosition === 'sidebar' && socialLinks && socialLinks.length > 0 && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 hidden md:flex flex-col gap-3">
          <BusinessSocialLinks 
            socialLinks={socialLinks} 
            iconsStyle={socialIconsStyle} 
            size={socialIconsSize}
            vertical={true}
          />
        </div>
      )}
      
      {/* Floating subscribe button */}
      <FloatingSubscribeButton 
        businessId={businessPage.business_id}
        visible={showFloatingSubscribe && enableFloatingBtn}
        showButton={showSubscribeButton}
        isAuthenticated={isAuthenticated}
        onAuthRequired={handleTrySubscribe}
        buttonStyle={buttonStyleConfig}
        size={subscribeButtonSize === 'small' ? "sm" : subscribeButtonSize === 'large' ? "lg" : "default"}
      />
      
      {/* Chatbot container */}
      <div ref={chatbotScriptRef} />
      
      <PoweredByWAKTI position="bottom" />
    </div>
  );
};

export default BusinessLandingPageComponent;

