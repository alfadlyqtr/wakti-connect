
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from "@/types/business.types";
import BusinessPageContent from "@/components/business/landing/BusinessPageContent";
import BusinessPageNotFound from "@/components/business/landing/BusinessPageNotFound";
import { useSubmitContactFormMutation } from "@/hooks/business-page/useContactSubmissionMutation";

const SimpleBusinessLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [businessPage, setBusinessPage] = useState<BusinessPage | null>(null);
  const [pageSections, setPageSections] = useState<BusinessPageSection[]>([]);
  const [socialLinks, setSocialLinks] = useState<BusinessSocialLink[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isPreviewMode] = useState(false);
  const contactFormMutation = useSubmitContactFormMutation();
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
  }, []);
  
  // Fetch business page data
  useEffect(() => {
    const fetchBusinessPage = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      
      try {
        // First fetch the business ID from slug
        const { data: businessData, error: businessError } = await supabase
          .from('profiles')
          .select('id')
          .eq('slug', slug)
          .single();
          
        if (businessError) {
          console.error("Error fetching business profile:", businessError);
          setIsLoading(false);
          return;
        }
        
        // Then fetch the page data
        const { data: pageData, error: pageError } = await supabase
          .from('business_pages')
          .select('*')
          .eq('business_id', businessData.id)
          .eq('is_published', true)
          .single();
          
        if (pageError) {
          console.error("Error fetching business page:", pageError);
          setIsLoading(false);
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
        } else {
          setPageSections(sectionsData as BusinessPageSection[]);
        }
        
        // Fetch social links
        const { data: socialData, error: socialError } = await supabase
          .from('business_social_links')
          .select('*')
          .eq('business_id', businessData.id);
          
        if (socialError) {
          console.error("Error fetching social links:", socialError);
        } else {
          console.log("Retrieved social links:", socialData);
          setSocialLinks(socialData as BusinessSocialLink[]);
        }
      } catch (err) {
        console.error("Error in business page fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinessPage();
  }, [slug]);

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
  
  if (!businessPage) {
    return <BusinessPageNotFound />;
  }
  
  return (
    <>
      <Helmet>
        <title>{slug ? `${slug} | WAKTI` : 'Business Page | WAKTI'}</title>
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
