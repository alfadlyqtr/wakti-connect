
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PublicLayout from '@/components/layout/PublicLayout';
import BusinessPageContent from '@/components/business/landing/BusinessPageContent';
import { useBusinessData } from '@/hooks/useBusinessData';
import { useAuth } from '@/features/auth/hooks/useAuth';

const SimpleBusinessLandingPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessPage, setBusinessPage] = useState<any>(null);
  const [pageSections, setPageSections] = useState<any[]>([]);

  // Use our new custom hook to fetch business data
  const { profile: businessProfile, socialLinks, isLoading: isBusinessDataLoading, error: businessDataError } = useBusinessData(businessId);

  useEffect(() => {
    const fetchBusinessPage = async () => {
      if (!businessId) {
        setError("Business ID is required");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Fetching business page for ID: ${businessId}`);

        // First try fetching by ID directly
        const { data: pageData, error: pageError } = await supabase
          .from('business_pages')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (pageError || !pageData) {
          console.log('No business page found, using default');
          
          // Create a default page using business profile data
          if (businessProfile) {
            setBusinessPage({
              business_id: businessId,
              page_title: businessProfile.business_name || 'Business Page',
              description: businessProfile.description || '',
              logo_url: businessProfile.avatar_url || '',
              primary_color: '#3B82F6',
              secondary_color: '#10B981',
              is_published: true
            });
          } else {
            setError("Business not found");
            setIsLoading(false);
            return;
          }
        } else {
          setBusinessPage(pageData);
        }

        // Get page sections if we have a page
        if (businessPage?.id) {
          const { data: sections, error: sectionsError } = await supabase
            .from('business_page_sections')
            .select('*')
            .eq('page_id', businessPage.id)
            .order('section_order', { ascending: true });

          if (sectionsError) {
            console.error('Error fetching page sections:', sectionsError);
          } else {
            setPageSections(sections || []);
          }
        } else {
          // Create default about section
          setPageSections([
            {
              id: 'default-about',
              page_id: 'default',
              section_type: 'about',
              section_order: 1,
              is_visible: true,
              section_content: {
                title: businessProfile?.business_name || 'About Us',
                description: 'Learn more about our business and what we do.',
                content: businessProfile?.description || ''
              }
            }
          ]);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching business page:', err);
        setError('Failed to load the business page');
        setIsLoading(false);
      }
    };

    if (!isBusinessDataLoading && businessProfile) {
      fetchBusinessPage();
    }
  }, [businessId, businessProfile, isBusinessDataLoading]);

  // Submit contact form handler
  const handleSubmitContactForm = async (data: any) => {
    try {
      const { error } = await supabase
        .from('business_contact_submissions')
        .insert([{
          business_id: data.businessId,
          page_id: data.pageId,
          name: data.formData.name,
          phone: data.formData.phone,
          email: data.formData.email,
          message: data.formData.message
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  };

  if (isLoading || isBusinessDataLoading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PublicLayout>
    );
  }

  if (error || businessDataError) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600">{error || businessDataError?.message || 'Could not load the business page'}</p>
          <p className="text-gray-500 mt-2">Please check the URL and try again.</p>
        </div>
      </PublicLayout>
    );
  }

  if (!businessPage && !businessProfile) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">Business Not Found</h1>
          <p className="text-gray-600">The business page you're looking for could not be found.</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <BusinessPageContent
        businessPage={businessPage}
        pageSections={pageSections}
        socialLinks={socialLinks}
        businessProfile={businessProfile}
        isPreviewMode={false}
        isAuthenticated={!!user}
        submitContactForm={handleSubmitContactForm}
      />
    </PublicLayout>
  );
};

export default SimpleBusinessLandingPage;
