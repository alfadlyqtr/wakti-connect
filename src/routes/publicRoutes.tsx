
import React from 'react';
import { Route } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFound';
import SharedInvitationView from '@/components/invitations/SharedInvitationView';

// Import actual implemented pages
import ContactPage from '@/pages/public/ContactPage';
import FeaturesPage from '@/pages/public/FeaturesPage';
import PricingPage from '@/pages/public/PricingPage';
import AboutPage from '@/pages/public/AboutPage';
import LandingPage from '@/pages/public/LandingPage';
import FaqPage from '@/pages/public/FaqPage';
import PrivacyPage from '@/pages/public/PrivacyPage';
import TermsPage from '@/pages/public/TermsPage';
import BusinessPublicView from '@/pages/public/BusinessPublicView';
import PublicLayout from '@/components/layout/PublicLayout';

// Define public routes with appropriate layout wrapper
export const publicRoutes = [
  {
    index: true,
    element: <PublicLayout><LandingPage /></PublicLayout>,
  },
  {
    path: 'about',
    element: <PublicLayout><AboutPage /></PublicLayout>,
  },
  {
    path: 'contact',
    element: <PublicLayout><ContactPage /></PublicLayout>,
  },
  {
    path: 'features',
    element: <PublicLayout><FeaturesPage /></PublicLayout>,
  },
  {
    path: 'pricing',
    element: <PublicLayout><PricingPage /></PublicLayout>,
  },
  {
    path: 'privacy',
    element: <PublicLayout><PrivacyPage /></PublicLayout>,
  },
  {
    path: 'terms',
    element: <PublicLayout><TermsPage /></PublicLayout>,
  },
  {
    path: 'faq',
    element: <PublicLayout><FaqPage /></PublicLayout>,
  },
  {
    path: 'i/:shareId',
    element: <PublicLayout><SharedInvitationView /></PublicLayout>,
  },
  {
    path: 'b/:slug',
    element: <BusinessPublicView />,
  },
  {
    path: 'business/:businessId',
    element: <BusinessPublicView />,
  },
  {
    path: '*',
    element: <PublicLayout><NotFoundPage /></PublicLayout>,
  },
];

export default publicRoutes;
