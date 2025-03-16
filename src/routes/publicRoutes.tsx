
import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import PricingPage from "@/pages/public/PricingPage";
import FeaturesPage from "@/pages/public/FeaturesPage";
import ContactPage from "@/pages/public/ContactPage";
import AboutPage from "@/pages/public/AboutPage";
import FaqPage from "@/pages/public/FaqPage";
import TermsPage from "@/pages/public/TermsPage";
import PrivacyPage from "@/pages/public/PrivacyPage";
import LandingPage from "@/pages/public/LandingPage";

const PublicRoutes = () => {
  return (
    <Routes>
      {/* The index route now uses LandingPage instead of Index */}
      <Route index element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      {/* Catch-all route for unmatched public routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
