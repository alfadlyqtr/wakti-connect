
import React from 'react';
import { Route } from 'react-router-dom';
import LandingPage from '@/pages/public/LandingPage';
import AboutPage from '@/pages/public/AboutPage';
import FeaturesPage from '@/pages/public/FeaturesPage';
import PricingPage from '@/pages/public/PricingPage';
import ContactPage from '@/pages/public/ContactPage';
import FaqPage from '@/pages/public/FaqPage';
import PrivacyPage from '@/pages/public/PrivacyPage';
import TermsPage from '@/pages/public/TermsPage';
import BusinessLandingPage from '@/pages/business/BusinessLandingPage';

const publicRoutes = (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/features" element={<FeaturesPage />} />
    <Route path="/pricing" element={<PricingPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/faq" element={<FaqPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/business/:slug" element={<BusinessLandingPage />} />
  </>
);

export default publicRoutes;
