
import React, { useEffect, useRef, useState } from "react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import BusinessSocialLinks from "./BusinessSocialLinks";
import BusinessPageHeader from "./sections/BusinessPageHeader";
import BusinessPageSections from "./BusinessPageSections";
import BusinessPageNotFound from "./BusinessPageNotFound";
import { BusinessProfile } from "@/types/business.types";
import PoweredByWAKTI from "./PoweredByWAKTI";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";

interface BusinessLandingPageComponentProps {
  slug?: string;
  isPreviewMode?: boolean;
}

const BusinessLandingPageComponent: React.FC<BusinessLandingPageComponentProps> = ({ 
  slug, 
  isPreviewMode = false 
}) => {
  const { businessPage, pageSections, socialLinks, isLoading } = useBusinessPage(slug);
  const { isSubscribed, subscriptionId, subscribe, unsubscribe, checkingSubscription } = useBusinessSubscribers(businessPage?.business_id);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const chatbotScriptRef = useRef<HTMLScriptElement | null>(null);
  const isMobile = useIsMobile();
  
  // Track if we should show the subscribe button floating
  const [showFloatingSubscribe, setShowFloatingSubscribe] = useState(false);
  
  React.useEffect(() => {
    // Skip auth check in preview mode
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
  
  // Track scroll position to show floating subscribe button
  useEffect(() => {
    if (!businessPage?.show_subscribe_button) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowFloatingSubscribe(scrollPosition > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [businessPage?.show_subscribe_button]);
  
  // Improved TMW AI Chatbot script injection with direct DOM manipulation
  useEffect(() => {
    // Clear any previously added chatbot scripts
    if (chatbotScriptRef.current) {
      try {
        document.body.removeChild(chatbotScriptRef.current);
        chatbotScriptRef.current = null;
      } catch (error) {
        console.error("Error removing previous chatbot script:", error);
      }
    }
    
    const existingScripts = document.querySelectorAll('[id^="tmw-chatbot"]');
    existingScripts.forEach(script => {
      try {
        script.parentNode?.removeChild(script);
      } catch (err) {
        console.error("Error removing existing chatbot script:", err);
      }
    });
    
    if (businessPage?.chatbot_enabled && businessPage?.chatbot_code) {
      try {
        console.log("TMW AI Chatbot is enabled with code:", businessPage.chatbot_code);
        
        // Create a script element
        const script = document.createElement('script');
        script.id = 'tmw-chatbot-script-' + Date.now(); // Unique ID to avoid conflicts
        chatbotScriptRef.current = script;
        
        // Clean the chatbot code
        let cleanCode = businessPage.chatbot_code.trim();
        
        // Set the script content
        if (cleanCode.startsWith('<script>') && cleanCode.endsWith('</script>')) {
          // Extract code from within script tags
          cleanCode = cleanCode.substring(8, cleanCode.length - 9);
        }
        
        // Add the script content directly to the script tag
        script.textContent = cleanCode;
        
        // Append to document body for better visibility
        document.body.appendChild(script);
        
        console.log('TMW AI Chatbot script has been injected', {
          id: script.id,
          content: cleanCode.substring(0, 50) + '...' // Log just the beginning for debugging
        });
      } catch (error) {
        console.error('Error injecting TMW AI Chatbot script:', error);
      }
    } else {
      console.log("TMW AI Chatbot is disabled or has no code", {
        enabled: businessPage?.chatbot_enabled,
        hasCode: !!businessPage?.chatbot_code
      });
    }
    
    // Cleanup function
    return () => {
      if (chatbotScriptRef.current) {
        try {
          document.body.removeChild(chatbotScriptRef.current);
          chatbotScriptRef.current = null;
        } catch (error) {
          console.error('Error removing TMW chatbot script on unmount:', error);
        }
      }
    };
  }, [businessPage?.chatbot_enabled, businessPage?.chatbot_code]);
  
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

  // Create a BusinessProfile object from businessPage
  const businessProfile: BusinessProfile = {
    id: businessPage.business_id,
    business_name: businessPage.page_title || "Business",
    account_type: "business"
  };

  const handleTrySubscribe = () => {
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      // Scroll to the alert
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };
  
  // Find the header section in the pageSections array
  const headerSection = pageSections?.find(s => s.section_type === 'header');
  const headerContent = headerSection?.section_content || {};
  
  // Only show the subscribe button if the business has enabled it
  const showSubscribeButton = !isPreviewMode && businessPage.show_subscribe_button !== false;
  
  // Get the primary color with fallback
  const primaryColor = businessPage.primary_color || '#7C3AED';
  const secondaryColor = businessPage.secondary_color || '#8B5CF6';
  
  // Apply gradient background to subscribe button
  const subscribeButtonStyle = {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top WAKTI Attribution - always visible, even in preview mode */}
      <PoweredByWAKTI position="top" />
      
      <div 
        style={{
          '--primary-color': primaryColor,
          '--secondary-color': secondaryColor
        } as React.CSSProperties}
        className="flex-1"
      >
        {/* Authentication Alert */}
        {showAuthAlert && (
          <div className="container mx-auto px-4 pt-4 z-30 sticky top-0">
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You need to create an account or log in to subscribe to this business.
              </AlertDescription>
              <div className="mt-2 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAuthAlert(false)}
                >
                  Dismiss
                </Button>
              </div>
            </Alert>
          </div>
        )}
        
        {/* Display the header section */}
        {headerSection && (
          <BusinessPageHeader content={headerContent} />
        )}
        
        {/* Main content with subscribe button */}
        <div className="container mx-auto px-4 py-4">
          {/* Subscribe button - if not in preview mode and business has enabled the button */}
          {showSubscribeButton && (
            <div className="mb-8 flex justify-center">
              {isAuthenticated ? (
                <Button 
                  size={isMobile ? "default" : "lg"}
                  style={subscribeButtonStyle}
                  className={cn(
                    "font-semibold text-white hover:opacity-90 rounded-full px-6 shadow-md transition-all",
                    "animate-fade-in flex items-center gap-2"
                  )}
                  onClick={isSubscribed ? unsubscribe.mutate : subscribe.mutate}
                  disabled={subscribe.isPending || unsubscribe.isPending || checkingSubscription}
                >
                  {checkingSubscription ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isSubscribed ? (
                    <>
                      <span className="i-lucide-heart-off" /> 
                      Unsubscribe
                    </>
                  ) : (
                    <>
                      <span className="i-lucide-heart" /> 
                      {businessPage.subscribe_button_text || "Subscribe"}
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  size={isMobile ? "default" : "lg"}
                  style={subscribeButtonStyle}
                  className={cn(
                    "font-semibold text-white hover:opacity-90 rounded-full px-6 shadow-md transition-all",
                    "animate-fade-in flex items-center gap-2"
                  )}
                  onClick={handleTrySubscribe}
                >
                  <span className="i-lucide-heart" /> 
                  {businessPage.subscribe_button_text || "Subscribe"}
                </Button>
              )}
            </div>
          )}
          
          <BusinessPageSections 
            pageSections={pageSections} 
            businessPage={businessPage} 
          />
          
          {/* Social Links Footer */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="mt-12 pt-6 border-t">
              <BusinessSocialLinks socialLinks={socialLinks} />
            </div>
          )}
        </div>
      </div>
      
      {/* Floating subscribe button when scrolling */}
      {showSubscribeButton && showFloatingSubscribe && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          {isAuthenticated ? (
            <Button 
              size="sm"
              style={subscribeButtonStyle}
              className="rounded-full shadow-lg text-white hover:scale-105 transition-transform"
              onClick={isSubscribed ? unsubscribe.mutate : subscribe.mutate}
              disabled={subscribe.isPending || unsubscribe.isPending || checkingSubscription}
            >
              {checkingSubscription ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSubscribed ? (
                <span className="i-lucide-heart-off" />
              ) : (
                <span className="i-lucide-heart" />
              )}
            </Button>
          ) : (
            <Button 
              size="sm"
              style={subscribeButtonStyle}
              className="rounded-full shadow-lg text-white hover:scale-105 transition-transform"
              onClick={handleTrySubscribe}
            >
              <span className="i-lucide-heart" />
            </Button>
          )}
        </div>
      )}
      
      {/* Bottom WAKTI Attribution - always visible */}
      <PoweredByWAKTI position="bottom" />
    </div>
  );
};

export default BusinessLandingPageComponent;
