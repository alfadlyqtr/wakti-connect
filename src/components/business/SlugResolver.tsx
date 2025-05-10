
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SimpleLoading from "./page-builder/simple-builder/SimpleLoading";

const SlugResolver = () => {
  const { slug } = useParams<{ slug: string }>();
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
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
        // First check if this is a business profile slug
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (profileData) {
          setRedirectTo(`/business/${profileData.id}`);
          return;
        }

        // If not a profile, check if it's a business page slug
        const { data: pageData, error: pageError } = await supabase
          .from('business_pages_data')
          .select('id')
          .eq('page_slug', slug)
          .maybeSingle();

        if (pageData) {
          setRedirectTo(`/view/business-page/${pageData.id}`);
        } else {
          setError("Page not found");
        }
      } catch (err) {
        console.error("Exception during slug resolution:", err);
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

  if (error || !redirectTo) {
    // If page not found, redirect to homepage
    return <Navigate to="/" replace />;
  }

  // Redirect to the resolved destination
  return <Navigate to={redirectTo} replace />;
};

export default SlugResolver;
