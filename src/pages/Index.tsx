
import React from "react";
import { Navigate } from "react-router-dom";
import LandingPage from "@/pages/public/LandingPage";

const Index = () => {
  // We'll directly render the landing page instead of redirecting,
  // which could cause additional rendering cycles
  return <LandingPage />;
};

export default Index;
