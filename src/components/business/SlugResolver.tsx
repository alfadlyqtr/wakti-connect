
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import BusinessLandingPage from "@/pages/business/BusinessLandingPage";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NotFound from "@/pages/NotFound";

const SlugResolver: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isBusinessPage, setIsBusinessPage] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIfBusinessSlug = async () => {
      if (!slug) {
        setIsBusinessPage(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check if this slug exists in the business_pages table
        const { data, error } = await supabase
          .from('business_pages')
          .select('page_slug, is_published')
          .eq('page_slug', slug)
          .single();

        if (error || !data || !data.is_published) {
          console.log("Not a valid business slug:", slug);
          setIsBusinessPage(false);
        } else {
          console.log("Found valid business slug:", slug);
          setIsBusinessPage(true);
        }
      } catch (error) {
        console.error("Error checking business slug:", error);
        setIsBusinessPage(false);
      }
      
      setIsLoading(false);
    };

    checkIfBusinessSlug();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isBusinessPage === true && slug) {
    // Pass the slug to the BusinessLandingPage component
    return <BusinessLandingPage slug={slug} />;
  }

  // If it's not a business page, show the NotFound page
  return <NotFound />;
};

export default SlugResolver;
