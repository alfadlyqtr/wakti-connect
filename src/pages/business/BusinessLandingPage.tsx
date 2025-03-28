
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import BusinessLandingPageComponent from "@/components/business/landing/BusinessLandingPage";
import Header from "@/components/landing/Header";

const BusinessLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  
  // Check if we're in preview mode
  const isPreviewMode = location.search.includes('preview=true');
  
  if (!slug) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Business Page Not Found</h1>
        <p className="text-muted-foreground mt-2">The URL is invalid.</p>
      </div>
    );
  }
  
  // Only render the Wakti header if NOT in preview mode
  return (
    <>
      {!isPreviewMode && <Header />}
      <BusinessLandingPageComponent slug={slug} isPreviewMode={isPreviewMode} />
    </>
  );
};

export default BusinessLandingPage;
