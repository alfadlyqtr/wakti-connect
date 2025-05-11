import React, { useEffect, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import useBusinessPageQueries from "@/hooks/business-page/useBusinessPageQueries";
import { useBusinessSocialLinks, BusinessSocialLink } from "@/hooks/useBusinessSocialLinks";
import { useBusinessHours } from "@/hooks/useBusinessHours";
import BusinessPageContent from "@/components/business/landing/BusinessPageContent";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";

// Create a simple hook for setting document title
const useTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

const BusinessPublicView = () => {
  
  const { slug, businessId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const { useBusinessPageQuery, usePageSectionsQuery, useBusinessSocialLinksQuery } = useBusinessPageQueries();

  // Use the businessId directly or derive it from the page data
  const loadableBusinessId = businessId || null;

  // Determine if preview mode is requested via URL parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setIsPreviewMode(queryParams.get('preview') === 'true');
  }, [location.search]);

  // Fetch business page data using the appropriate identifier (slug or business ID)
  const { data: businessPage, isLoading: pageLoading, error: pageError } = useBusinessPageQuery(
    slug || null,
    isPreviewMode
  );

  // Fetch page sections once we have the business page ID
  const { data: pageSections, isLoading: sectionsLoading } = usePageSectionsQuery(
    businessPage?.id
  );

  // Fetch social links using business ID from the page data
  const { data: socialLinksData, isLoading: linksLoading } = useBusinessSocialLinksQuery(
    businessPage?.business_id
  );
  
  // Convert socialLinksData to the expected BusinessSocialLink type
  // Ensuring all required fields exist and types match
  const socialLinks: BusinessSocialLink[] = socialLinksData ? socialLinksData.map(link => ({
    id: link.id,
    business_id: link.business_id,
    platform: link.platform as BusinessSocialLink['platform'],
    url: link.url,
    created_at: link.created_at || new Date().toISOString()
    // Note: We're not including updated_at here as it's not required by BusinessSocialLink type
  })) : [];

  
  
  // Fetch business hours data
  const { businessHours, isLoading: hoursLoading } = useBusinessHours(
    businessPage?.business_id
  );

  // Fetch social settings
  const { socialSettings, isLoading: settingsLoading } = useBusinessSocialLinks(
    businessPage?.business_id
  );

  // Update the page title
  useTitle(businessPage?.page_title || "Business Page");

  // Handle various loading and error states
  const isLoading = pageLoading || sectionsLoading || linksLoading;
  const hasError = !!pageError;

  if (isLoading) {
    return (
      <div className="py-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="h-10 w-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !businessPage) {
    return (
      <div className="py-10">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
            <p className="mb-6 text-muted-foreground">
              Sorry, the business page you're looking for does not exist or has been removed.
            </p>
            <Button variant="default" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Determine if the current user is authenticated and is viewing their own page
  const isAuthenticated = !!user;
  const isOwnPage = isAuthenticated && user.id === businessPage.business_id;

  // Show the page content if a valid page was found
  return (
    <BusinessPageContent 
      businessPage={businessPage} 
      pageSections={pageSections || []} 
      socialLinks={socialLinks}
      isPreviewMode={isPreviewMode}
      isAuthenticated={isAuthenticated}
      businessHours={businessHours}
      displayStyle={socialSettings?.display_style || 'icons'}
    />
  );
};

export default BusinessPublicView;
