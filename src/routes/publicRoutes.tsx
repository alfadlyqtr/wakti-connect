
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

// Temporary placeholder component for missing pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="container mx-auto px-4 py-16 text-center">
    <h1 className="text-3xl font-bold mb-4">{title} Page</h1>
    <p className="text-muted-foreground">This page is currently under construction.</p>
  </div>
);

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
