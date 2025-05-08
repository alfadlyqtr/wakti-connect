
import React from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";

const BusinessLandingPage = () => {
  return (
    <>
      <Helmet>
        <title>Feature Removed | WAKTI</title>
      </Helmet>
      <Navigate to="/" replace />
    </>
  );
};

export default BusinessLandingPage;
