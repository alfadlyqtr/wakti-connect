
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
import SlugResolver from '@/components/business/SlugResolver';

// Temporary placeholder component for missing pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="container mx-auto px-4 py-16 text-center">
    <h1 className="text-3xl font-bold mb-4">{title} Page</h1>
    <p className="text-muted-foreground">This page is currently under construction.</p>
  </div>
);

export const publicRoutes = [
  {
    index: true,
    element: <LandingPage />,
  },
  {
    path: 'about',
    element: <AboutPage />,
  },
  {
    path: 'contact',
    element: <ContactPage />,
  },
  {
    path: 'features',
    element: <FeaturesPage />,
  },
  {
    path: 'pricing',
    element: <PricingPage />,
  },
  {
    path: 'privacy',
    element: <PrivacyPage />,
  },
  {
    path: 'terms',
    element: <TermsPage />,
  },
  {
    path: 'faq',
    element: <FaqPage />,
  },
  {
    path: 'i/:shareId',
    element: <SharedInvitationView />,
  },
  {
    path: ':slug',
    element: <SlugResolver />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default publicRoutes;
