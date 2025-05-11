
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from "@/types/business.types";
import BusinessPageContent from "@/components/business/landing/BusinessPageContent";
import BusinessPageNotFound from "@/components/business/landing/BusinessPageNotFound";
import { useSubmitContactFormMutation } from "@/hooks/business-page/useContactSubmissionMutation";

const SimpleBusinessLandingPage = () => {
  const { businessId, slug } = useParams<{ businessId?: string; slug?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [businessPage, setBusinessPage] = useState<BusinessPage | null>(null);
  const [pageSections, setPageSections] = useState<BusinessPageSection[]>([]);
  const [socialLinks, setSocialLinks] = useState<BusinessSocialLink[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isPreviewMode] = useState(false);
  const contactFormMutation = useSubmitContactFormMutation();
  const [error, setError] = useState<string | null>(null);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
  }, []);
  
  // Clean business ID to handle malformed IDs
  const cleanBusinessId = businessId ? businessId.replace(/[^0-9a-zA-Z-]/g, '') : '';
  
  // Fetch business page data
  useEffect(() => {
    const fetchBusinessPage = async () => {
      if (!cleanBusinessId && !slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Determine which identifier to use (businessId directly or lookup by slug)
        let targetBusinessId = cleanBusinessId;
        
        // If we have a slug but no businessId, we need to look up the business ID first
        if (slug && !cleanBusinessId) {
          console.log("Looking up business ID by slug:", slug);
          const { data: businessData, error: businessError } = await supabase
            .from('profiles')
            .select('id')
            .eq('slug', slug)
            .single();
            
          if (businessError) {
            console.error("Error fetching business profile by slug:", businessError);
            setIsLoading(false);
            setError(`Failed to find business profile with slug: ${slug}`);
            return;
          }
          
          targetBusinessId = businessData.id;
          console.log("Found business ID from slug:", targetBusinessId);
        }
        
        // Attempt to find the business by partial ID if the ID doesn't look complete
        // A UUID should be 36 characters (including hyphens)
        if (targetBusinessId && targetBusinessId.length < 36) {
          console.log("Business ID may be incomplete, attempting partial match:", targetBusinessId);
          
          const { data: partialMatchData, error: partialMatchError } = await supabase
            .from('profiles')
            .select('id')
            .ilike('id', `%${targetBusinessId}%`)
            .limit(1);
            
          if (!partialMatchError && partialMatchData && partialMatchData.length > 0) {
            targetBusinessId = partialMatchData[0].id;
            console.log("Found business by partial ID match:", targetBusinessId);
          }
        }
        
        // With the business ID, fetch the page data
        if (!targetBusinessId) {
          console.error("No business ID available to fetch page data");
          setIsLoading(false);
          setError("Business ID not found");
          return;
        }
        
        console.log("Fetching business page for ID:", targetBusinessId);
        
        // Then fetch the page data
        const { data: pageData, error: pageError } = await supabase
          .from('business_pages')
          .select('*')
          .eq('business_id', targetBusinessId)
          .eq('is_published', true)
          .single();
          
        if (pageError) {
          console.error("Error fetching business page:", pageError);
          setIsLoading(false);
          setError(`Failed to load business page for ID: ${targetBusinessId}`);
          return;
        }
        
        setBusinessPage(pageData as BusinessPage);
        
        // Fetch page sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('business_page_sections')
          .select('*')
          .eq('page_id', pageData.id)
          .order('section_order', { ascending: true });
          
        if (sectionsError) {
          console.error("Error fetching page sections:", sectionsError);
          setError(`Failed to load page sections: ${sectionsError.message}`);
        } else {
          setPageSections(sectionsData as BusinessPageSection[]);
        }
        
        // Fetch social links
        const { data: socialData, error: socialError } = await supabase
          .from('business_social_links')
          .select('*')
          .eq('business_id', targetBusinessId);
          
        if (socialError) {
          console.error("Error fetching social links:", socialError);
          setError(`Failed to load social links: ${socialError.message}`);
        } else {
          console.log("Retrieved social links:", socialData);
          setSocialLinks(socialData as BusinessSocialLink[]);
        }
      } catch (err) {
        console.error("Error in business page fetch:", err);
        setError(`Unexpected error loading the business page: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinessPage();
  }, [cleanBusinessId, slug]);

  // Handle contact form submission
  const handleContactFormSubmit = async (data: any) => {
    return contactFormMutation.mutateAsync(data);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading page...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">If you believe this is an error, please check the URL and try again.</p>
        </div>
      </div>
    );
  }
  
  if (!businessPage) {
    return <BusinessPageNotFound />;
  }
  
  return (
    <>
      <Helmet>
        <title>{businessPage.page_title ? `${businessPage.page_title} | WAKTI` : 'Business Page | WAKTI'}</title>
      </Helmet>
      <div className="min-h-screen">
        <BusinessPageContent
          businessPage={businessPage}
          pageSections={pageSections}
          socialLinks={socialLinks}
          isPreviewMode={isPreviewMode}
          isAuthenticated={isAuthenticated}
          submitContactForm={handleContactFormSubmit}
        />
      </div>
    </>
  );
};

export default SimpleBusinessLandingPage;
