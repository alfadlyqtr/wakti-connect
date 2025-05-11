
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SlugResolver = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const resolveSlug = async () => {
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        // Check if the slug corresponds to a business profile
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('slug', slug)
          .single();

        if (error || !data) {
          console.error("Error resolving slug or not found:", error);
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        // If we found a business with this slug, redirect to the business landing page
        const businessId = data.id;
        navigate(`/business/${businessId}`, { replace: true });
      } catch (err) {
        console.error("Error in slug resolution:", err);
        setNotFound(true);
        setIsLoading(false);
      }
    };

    resolveSlug();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound) {
    // This will be caught by the catch-all route
    navigate('/not-found', { replace: true });
    return null;
  }

  return null;
};

export default SlugResolver;
