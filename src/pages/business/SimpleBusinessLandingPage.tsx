
import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import BusinessLandingPageComponent from "@/components/business/landing/BusinessLandingPage";

const SimpleBusinessLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <>
      <Helmet>
        <title>{slug ? `${slug} | WAKTI` : 'Business Page | WAKTI'}</title>
      </Helmet>
      <BusinessLandingPageComponent />
    </>
  );
};

export default SimpleBusinessLandingPage;
