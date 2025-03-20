
import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import BusinessSocialLinks from "./BusinessSocialLinks";
import BusinessPageHeader from "./BusinessPageHeader";
import BusinessPageSections from "./BusinessPageSections";
import BusinessPageNotFound from "./BusinessPageNotFound";
import { BusinessProfile } from "@/types/business.types";

const BusinessLandingPageComponent = () => {
  const { slug } = useParams<{ slug: string }>();
  const { businessPage, pageSections, socialLinks, isLoading } = useBusinessPage(slug);
  const { isSubscribed, subscriptionId, subscribe, unsubscribe, checkingSubscription } = useBusinessSubscribers(businessPage?.business_id);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const location = useLocation();
  
  // Check if we're in preview mode
  const isPreviewMode = location.search.includes('preview=true');
  
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
  
  return (
    <div 
      style={{
        '--primary-color': businessPage.primary_color,
        '--secondary-color': businessPage.secondary_color
      } as React.CSSProperties}
      className="min-h-screen pb-16"
    >
      <BusinessPageHeader 
        business={businessProfile}
        isPreviewMode={isPreviewMode}
        isAuthenticated={isAuthenticated}
        isSubscribed={isSubscribed}
        subscriptionId={subscriptionId}
        checkingSubscription={checkingSubscription}
        subscribe={subscribe}
        unsubscribe={unsubscribe}
      />
      
      <div className="container mx-auto px-4">
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
  );
};

export default BusinessLandingPageComponent;
