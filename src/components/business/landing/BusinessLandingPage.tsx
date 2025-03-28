
import React, { useEffect } from "react";
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
  
  // Inject TMW AI Chatbot script if enabled
  useEffect(() => {
    if (businessPage?.chatbot_enabled && businessPage?.chatbot_code) {
      // Create a script element to inject the chatbot code
      const script = document.createElement('script');
      script.id = 'tmw-chatbot-script';
      script.innerHTML = businessPage.chatbot_code;
      document.body.appendChild(script);
      
      // Cleanup function to remove the script when component unmounts
      return () => {
        const existingScript = document.getElementById('tmw-chatbot-script');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
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
