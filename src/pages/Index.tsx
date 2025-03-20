
import React from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect the root path to landing page
  return <Navigate to="/" replace />;
};

export default Index;
