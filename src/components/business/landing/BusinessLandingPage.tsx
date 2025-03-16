
import React from "react";
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
  
  return (
    <div 
      style={{
        '--primary-color': businessPage.primary_color,
        '--secondary-color': businessPage.secondary_color
      } as React.CSSProperties}
      className="min-h-screen pb-16"
    >
      <BusinessPageHeader 
        businessPage={businessPage}
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
