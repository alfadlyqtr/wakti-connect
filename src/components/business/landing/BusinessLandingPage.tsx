
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Loader2, Calendar, MapPin, Clock, Phone, Mail, Globe, Share2 } from "lucide-react";
import { SectionType } from "@/types/business.types";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import BusinessSocialLinks from "./BusinessSocialLinks";
import BusinessServicesList from "./BusinessServicesList";
import BusinessGallery from "./BusinessGallery";
import BusinessHeader from "./BusinessHeader";
import BusinessHours from "./BusinessHours";
import BusinessContactInfo from "./BusinessContactInfo";
import BusinessAbout from "./BusinessAbout";
import BusinessTestimonials from "./BusinessTestimonials";
import { format } from "date-fns";

const BusinessLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { 
    businessPage, 
    pageSections, 
    socialLinks,
    isLoading 
  } = useBusinessPage(slug);
  
  const { 
    isSubscribed, 
    subscribe, 
    unsubscribe, 
    subscriptionLoading
  } = useBusinessSubscribers(businessPage?.business_id);
  
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  // Check if user is logged in
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session?.user);
    };
    checkAuth();
  }, []);
  
  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please log in to subscribe to this business.",
        action: (
          <Button onClick={() => navigate("/auth")}>
            Login
          </Button>
        )
      });
      return;
    }
    
    if (!businessPage?.business_id) return;
    
    if (isSubscribed) {
      unsubscribe.mutate(businessPage.business_id);
    } else {
      subscribe.mutate(businessPage.business_id);
    }
  };
  
  const handleSharePage = () => {
    if (navigator.share) {
      navigator.share({
        title: businessPage?.page_title || 'Business Landing Page',
        url: window.location.href
      })
      .catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "The page link has been copied to your clipboard."
      });
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Render 404 if page not found
  if (!businessPage) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Business Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The business page you're looking for doesn't exist or isn't published yet.
        </p>
        <Button onClick={() => navigate("/")}>
          Return Home
        </Button>
      </div>
    );
  }
  
  // Set page style based on business colors
  const pageStyle = {
    '--primary-color': businessPage.primary_color || '#3B82F6',
    '--secondary-color': businessPage.secondary_color || '#10B981',
  } as React.CSSProperties;
  
  // Render each section based on its type
  const renderSection = (section: any) => {
    const sectionType = section.section_type as SectionType;
    
    switch (sectionType) {
      case 'header':
        return <BusinessHeader section={section} businessPage={businessPage} />;
      case 'services':
        return <BusinessServicesList section={section} businessId={businessPage.business_id} />;
      case 'hours':
        return <BusinessHours section={section} />;
      case 'contact':
        return <BusinessContactInfo section={section} />;
      case 'gallery':
        return <BusinessGallery section={section} />;
      case 'about':
        return <BusinessAbout section={section} />;
      case 'testimonials':
        return <BusinessTestimonials section={section} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen bg-background"
      style={pageStyle}
    >
      {/* Business Banner */}
      {businessPage.banner_url && (
        <div 
          className="w-full h-48 md:h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${businessPage.banner_url})` }}
        />
      )}
      
      {/* Business Info Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            {businessPage.logo_url && (
              <img 
                src={businessPage.logo_url} 
                alt={`${businessPage.page_title} logo`}
                className="w-16 h-16 rounded-full object-cover border border-border"
              />
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{businessPage.page_title}</h1>
              {businessPage.description && (
                <p className="text-muted-foreground mt-1">{businessPage.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              onClick={handleSubscribe}
              disabled={subscriptionLoading}
              variant={isSubscribed ? "outline" : "default"}
            >
              {subscriptionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </Button>
            
            <Button onClick={handleSharePage} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
      
      {/* Business Social Links */}
      {socialLinks && socialLinks.length > 0 && (
        <div className="container mx-auto px-4 pb-6">
          <BusinessSocialLinks socialLinks={socialLinks} />
        </div>
      )}
      
      {/* Render Page Sections */}
      <div className="container mx-auto px-4 py-6">
        {pageSections && pageSections.length > 0 ? (
          pageSections
            .filter(section => section.is_visible)
            .map(section => (
              <div key={section.id} className="mb-10">
                {renderSection(section)}
              </div>
            ))
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h2 className="text-xl font-medium mb-2">No Content Available</h2>
            <p className="text-muted-foreground">
              This business page is still being set up.
            </p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-muted py-6 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} {businessPage.page_title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {format(new Date(businessPage.updated_at), 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-xs text-muted-foreground">
                Powered by <span className="font-semibold">WAKTI</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BusinessLandingPage;
