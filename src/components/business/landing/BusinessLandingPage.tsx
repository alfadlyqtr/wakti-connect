
import React, { useEffect, useRef } from "react";
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
import BusinessSubscribeButton from "./BusinessSubscribeButton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [showAuthAlert, setShowAuthAlert] = React.useState(false);
  const chatbotScriptRef = useRef<HTMLScriptElement | null>(null);
  
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
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top WAKTI Attribution - only show when not in preview mode */}
      {!isPreviewMode && <PoweredByWAKTI position="top" />}
      
      <div 
        style={{
          '--primary-color': businessPage.primary_color || '#7C3AED',
          '--secondary-color': businessPage.secondary_color || '#8B5CF6'
        } as React.CSSProperties}
        className="flex-1"
      >
        {/* Authentication Alert */}
        {showAuthAlert && (
          <div className="container mx-auto px-4 pt-4">
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You need to create an account or log in to subscribe to this business.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Find the header section in the pageSections array */}
        <BusinessPageHeader 
          content={pageSections?.find(s => s.section_type === 'header')?.section_content || {}}
        />
        
        <div className="container mx-auto px-4 py-4">
          {/* Subscribe button - if not in preview mode and business has enabled the button */}
          {!isPreviewMode && businessPage.show_subscribe_button !== false && (
            <div className="flex justify-end mb-6">
              {isAuthenticated ? (
                <BusinessSubscribeButton 
                  businessId={businessPage.business_id} 
                  customText={businessPage.subscribe_button_text}
                />
              ) : (
                <Button 
                  variant="outline" 
                  onClick={handleTrySubscribe}
                >
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
      
      {/* Bottom WAKTI Attribution */}
      <PoweredByWAKTI position="bottom" />
    </div>
  );
};

export default BusinessLandingPageComponent;
