
import React from "react";
import { useParams } from "react-router-dom";
import BusinessLandingPageComponent from "@/components/business/landing/BusinessLandingPage";
import Header from "@/components/landing/Header";

const BusinessPage: React.FC = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  if (!businessSlug) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Business Page Not Found</h1>
        <p className="text-muted-foreground mt-2">Invalid URL.</p>
      </div>
    );
  }
  
  return (
    <>
      <Header />
      <BusinessLandingPageComponent />
    </>
  );
};

export default BusinessPage;
