
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from "@/types/business.types";
import { useBusinessData } from "@/hooks/useBusinessData";
import PublicLayout from "@/components/layout/PublicLayout";
import { BusinessPageContent, BusinessPageNotFound } from "@/features/business";
import { useBusinessPageQuery, useSocialLinksQuery, usePageSectionsQuery } from "@/hooks/business-page/useBusinessPageQueries";

const EnhancedBusinessLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const { profile: businessProfile, socialLinks, isLoading: profileLoading } = useBusinessData(slug);
  const { data: businessPage, isLoading: pageLoading } = useBusinessPageQuery(slug);
  const { data: pageSections, isLoading: sectionsLoading } = usePageSectionsQuery(businessPage?.id);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
  }, []);

  // Display loading state or not found page if needed
  if (profileLoading || pageLoading || sectionsLoading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-muted-foreground">Loading business page...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // If no business profile or page exists, show not found page
  if (!businessProfile || !businessPage) {
    return <BusinessPageNotFound />;
  }

  // Handle contact form submissions
  const submitContactForm = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('business_contact_submissions')
        .insert({
          business_id: businessProfile.id,
          page_id: businessPage.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        });
        
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error submitting contact form:", error);
      return { success: false, error };
    }
  };

  return (
    <PublicLayout>
      <BusinessPageContent
        businessPage={businessPage}
        pageSections={pageSections || []}
        socialLinks={socialLinks}
        businessProfile={businessProfile} 
        isPreviewMode={false}
        isAuthenticated={isAuthenticated}
        submitContactForm={submitContactForm}
      />
    </PublicLayout>
  );
};

export default EnhancedBusinessLandingPage;
