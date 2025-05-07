
import React from "react";
import { Helmet } from "react-helmet-async";
import SimpleLandingPageView from "@/components/business/simple-landing-page/SimpleLandingPageView";

interface BusinessLandingPageProps {
  isPreview?: boolean;
}

const SimpleBusinessLandingPage: React.FC<BusinessLandingPageProps> = ({ isPreview = false }) => {
  return (
    <>
      <Helmet>
        <title>Business Landing Page</title>
        <meta name="description" content="Business landing page" />
      </Helmet>
      <SimpleLandingPageView isPreview={isPreview} />
    </>
  );
};

export default SimpleBusinessLandingPage;
