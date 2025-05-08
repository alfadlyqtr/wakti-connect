
import React from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";

interface BusinessLandingPageProps {
  isPreview?: boolean;
}

const SimpleBusinessLandingPage: React.FC<BusinessLandingPageProps> = () => {
  return (
    <>
      <Helmet>
        <title>Feature Removed | WAKTI</title>
      </Helmet>
      <Navigate to="/" replace />
    </>
  );
};

export default SimpleBusinessLandingPage;
