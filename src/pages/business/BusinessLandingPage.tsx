
import React from "react";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import BusinessLandingPageComponent from "@/components/business/landing/BusinessLandingPage";
import Header from "@/components/landing/Header";
import { Helmet } from "react-helmet-async";

interface BusinessLandingPageProps {
  isPreview?: boolean;
}

const BusinessLandingPage: React.FC<BusinessLandingPageProps> = ({ isPreview: isPreviewProp }) => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Check if we're in preview mode from props, URL path, or search param
  const isPreviewMode = isPreviewProp || 
                      location.pathname.endsWith('/preview') || 
                      searchParams.get('preview') === 'true';
  
  // Extract business page name for SEO title
  const businessName = slug?.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Log the current path for debugging
  React.useEffect(() => {
    console.log("BusinessLandingPage mounted");
    console.log("Current path:", location.pathname);
    console.log("Is preview mode:", isPreviewMode);
    console.log("Slug:", slug);
  }, [location.pathname, isPreviewMode, slug]);
  
  if (!slug) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Business Page Not Found</h1>
        <p className="text-muted-foreground mt-2">The URL is invalid.</p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{businessName ? `${businessName} | WAKTI` : 'Business Page | WAKTI'}</title>
      </Helmet>
      
      {/* Only render the Wakti header if NOT in preview mode */}
      {!isPreviewMode && <Header />}
      <BusinessLandingPageComponent slug={slug} isPreviewMode={isPreviewMode} />
    </>
  );
};

export default BusinessLandingPage;
