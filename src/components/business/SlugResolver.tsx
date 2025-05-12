
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import EnhancedBusinessLandingPage from "@/pages/business/EnhancedBusinessLandingPage";
import { useBusinessData } from "@/hooks/useBusinessData";
import { Loader2 } from "lucide-react";

const SlugResolver = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Fetch the business profile using the slug to confirm it exists
  const { profile, isLoading, error } = useBusinessData(slug);
  
  // If we're still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-wakti-blue" />
        <p className="mt-4 text-muted-foreground">Loading business page...</p>
      </div>
    );
  }
  
  // If there was an error or no profile found, display the enhanced landing page
  // which will handle the error state internally
  return <EnhancedBusinessLandingPage />;
};

export default SlugResolver;
