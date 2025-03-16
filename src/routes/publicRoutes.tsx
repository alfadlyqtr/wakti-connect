
import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/public/LandingPage";
import NotFound from "@/pages/NotFound";
import PricingPage from "@/pages/public/PricingPage";
import FeaturesPage from "@/pages/public/FeaturesPage";
import ContactPage from "@/pages/public/ContactPage";
import AboutPage from "@/pages/public/AboutPage";
import FaqPage from "@/pages/public/FaqPage";
import TermsPage from "@/pages/public/TermsPage";
import PrivacyPage from "@/pages/public/PrivacyPage";
import Footer from "@/components/landing/Footer";
import BusinessLandingPage from "@/pages/business/BusinessLandingPage";

const PublicRoutes = () => {
  return (
    <>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="business/:slug" element={<BusinessLandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default PublicRoutes;
