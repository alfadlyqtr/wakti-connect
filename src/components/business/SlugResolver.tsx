
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SlugResolver = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to not found page since business pages have been removed
    navigate('/not-found', { replace: true });
  }, [navigate]);

  return null;
};

export default SlugResolver;
