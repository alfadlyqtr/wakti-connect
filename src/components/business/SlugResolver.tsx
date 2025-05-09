
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SimpleLoading from "./page-builder/simple-builder/SimpleLoading";

const SlugResolver = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pageId, setPageId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBySlug = async () => {
      if (!slug) {
        setIsLoading(false);
        setError("No slug provided");
        return;
      }

      try {
        // First, check if this is a business profile slug
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('slug', slug)
          .eq('account_type', 'business')
          .maybeSingle();

        if (profileData) {
          setProfileId(profileData.id);
          setIsLoading(false);
          return;
        }

        // If not a profile, check if it's a business page
        const { data: pageData, error: pageError } = await supabase
          .from('business_pages_data')
          .select('id')
          .eq('page_slug', slug)
          .maybeSingle();

        if (pageData) {
          setPageId(pageData.id);
        } else {
          setError("Page or profile not found");
        }
      } catch (err) {
        console.error("Exception during fetch:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBySlug();
  }, [slug]);

  if (isLoading) {
    return <SimpleLoading />;
  }

  if (profileId) {
    // If it's a business profile, redirect to the business profile page
    return <Navigate to={`/profile/${slug}`} replace />;
  }

  if (pageId) {
    // If it's a business page, redirect to the business page view
    return <Navigate to={`/view/business-page/${pageId}`} replace />;
  }

  // If neither found, redirect to homepage
  return <Navigate to="/" replace />;
};

export default SlugResolver;
