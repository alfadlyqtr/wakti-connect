
import React, { useEffect } from "react";
import { useParams, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import BusinessLandingPageComponent from "@/components/business/landing/BusinessLandingPage";
import { Helmet } from "react-helmet-async";
import { toast } from "@/components/ui/use-toast";

interface BusinessLandingPageProps {
  isPreview?: boolean;
  slug?: string; // Added direct slug prop
}

const BusinessLandingPage: React.FC<BusinessLandingPageProps> = ({ isPreview: isPreviewProp, slug: slugProp }) => {
  const params = useParams<{ slug: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Use the slug prop if provided, otherwise use the param from the URL
  const slug = slugProp || params.slug;
  
  // Check if we're in preview mode from props, URL path, or search param
  const isPreviewMode = isPreviewProp || 
                      location.pathname.endsWith('/preview') || 
                      searchParams.get('preview') === 'true';
  
  // Extract business page name for SEO title
  const businessName = slug?.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  useEffect(() => {
    if (!slug) {
      toast({
        title: "Business Page Not Found",
        description: "The URL is invalid or the business page doesn't exist.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [slug, navigate]);
  
  if (!slug) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold">Business Page Not Found</h1>
          <p className="text-muted-foreground mt-2 mb-6">The URL is invalid or the page doesn't exist.</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{businessName ? `${businessName} | WAKTI` : 'Business Page | WAKTI'}</title>
      </Helmet>
      
      <BusinessLandingPageComponent slug={slug} isPreviewMode={isPreviewMode} />
    </>
  );
};

export default BusinessLandingPage;
