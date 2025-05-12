
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SimpleBusinessLandingPage from "@/pages/business/SimpleBusinessLandingPage";

const SlugResolver = () => {
  const navigate = useNavigate();
  
  // Instead of redirecting to 404, display the SimpleBusinessLandingPage
  // which will communicate that business pages are no longer available
  return <SimpleBusinessLandingPage />;
};

export default SlugResolver;
