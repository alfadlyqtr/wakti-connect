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
  const { isSubscribed, subscriptionId, checkingSubscription } = useBusinessSubscribers(businessPage?.business_id);
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
  
  const subscribeButtonStyle = {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <PoweredByWAKTI position="top" />
      
      <div 
        style={{
          '--primary-color': primaryColor,
          '--secondary-color': secondaryColor
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
                    "font-semibold text-white hover:opacity-90 rounded-full px-6 shadow-md transition-all",
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
                    "font-semibold text-white hover:opacity-90 rounded-full px-6 shadow-md transition-all",
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
