
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SimpleLoading from "./page-builder/simple-builder/SimpleLoading";

const SlugResolver = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pageId, setPageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageBySlug = async () => {
      if (!slug) {
        setIsLoading(false);
        setError("No slug provided");
        return;
      }

      try {
        const { data, error } = await supabase
          .from('business_pages_data')
          .select('id')
          .eq('page_slug', slug)
          .single();

        if (error) {
          console.error("Error fetching page by slug:", error);
          setError("Page not found");
        } else if (data) {
          setPageId(data.id);
        } else {
          setError("Page not found");
        }
      } catch (err) {
        console.error("Exception during page fetch:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageBySlug();
  }, [slug]);

  if (isLoading) {
    return <SimpleLoading />;
  }

  if (error || !pageId) {
    // If page not found, redirect to homepage
    return <Navigate to="/" replace />;
  }

  // If page found, redirect to the business page view
  return <Navigate to={`/view/business-page/${pageId}`} replace />;
};

export default SlugResolver;
