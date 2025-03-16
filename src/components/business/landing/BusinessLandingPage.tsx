
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { BusinessPageSection } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Import page section components
import BusinessHeader from "./BusinessHeader";
import BusinessAbout from "./BusinessAbout";
import BusinessServicesList from "./BusinessServicesList";
import BusinessContactInfo from "./BusinessContactInfo";
import BusinessGallery from "./BusinessGallery";
import BusinessHours from "./BusinessHours";
import BusinessTestimonials from "./BusinessTestimonials";
import BusinessSocialLinks from "./BusinessSocialLinks";

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
  
  const handleSubscribe = () => {
    if (!businessPage?.business_id) return;
    
    if (isAuthenticated === false) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe to this business.",
        variant: "destructive"
      });
      return;
    }
    
    subscribe.mutate(businessPage.business_id);
  };
  
  const handleUnsubscribe = () => {
    if (!subscriptionId) return;
    unsubscribe.mutate(subscriptionId);
  };
  
  const renderSection = (section: BusinessPageSection) => {
    if (!section.is_visible) return null;
    
    switch (section.section_type) {
      case 'header':
        return businessPage ? (
          <BusinessHeader key={section.id} section={section} businessPage={businessPage} />
        ) : null;
      
      case 'about':
        return <BusinessAbout key={section.id} section={section} />;
      
      case 'services':
        return <BusinessServicesList key={section.id} section={section} businessId={businessPage?.business_id} />;
      
      case 'contact':
        return <BusinessContactInfo key={section.id} section={section} />;
      
      case 'gallery':
        return <BusinessGallery key={section.id} section={section} />;
      
      case 'hours':
        return <BusinessHours key={section.id} section={section} />;
      
      case 'testimonials':
        return <BusinessTestimonials key={section.id} section={section} />;
      
      default:
        return (
          <div key={section.id} className="py-6">
            <p className="text-muted-foreground text-center">Unknown section type</p>
          </div>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!businessPage) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Business Page Not Found</h1>
        <p className="text-muted-foreground">
          The business page you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }
  
  return (
    <div 
      style={{
        '--primary-color': businessPage.primary_color,
        '--secondary-color': businessPage.secondary_color
      } as React.CSSProperties}
      className="min-h-screen pb-16"
    >
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {businessPage.logo_url ? (
              <img 
                src={businessPage.logo_url} 
                alt={`${businessPage.page_title} logo`}
                className="h-8 w-auto"
              />
            ) : null}
            <span className="font-medium">{businessPage.page_title}</span>
          </div>
          
          <div>
            {!isPreviewMode && isAuthenticated !== null && (
              checkingSubscription ? (
                <Button variant="outline" disabled size="sm">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </Button>
              ) : isSubscribed ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleUnsubscribe}
                  disabled={unsubscribe.isPending}
                >
                  {unsubscribe.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Unsubscribe
                </Button>
              ) : (
                <Button 
                  size="sm"
                  onClick={handleSubscribe}
                  disabled={subscribe.isPending}
                >
                  {subscribe.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Subscribe
                </Button>
              )
            )}
            
            {isPreviewMode && (
              <div className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs px-3 py-1 rounded-full font-medium">
                Preview Mode
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* If no sections, show a default header */}
        {(!pageSections || pageSections.length === 0) && (
          <div className="py-16 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {businessPage.page_title}
            </h1>
            {businessPage.description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {businessPage.description}
              </p>
            )}
          </div>
        )}
        
        {/* Render page sections in order */}
        {pageSections && pageSections.length > 0 && 
          pageSections
            .sort((a, b) => a.section_order - b.section_order)
            .map(renderSection)
        }
        
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
