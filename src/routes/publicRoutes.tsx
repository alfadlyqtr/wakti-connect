
import React from 'react';
import { Route } from 'react-router-dom';
import Home from '@/pages/Home';
import AboutPage from '@/pages/About';
import ContactPage from '@/pages/Contact';
import FeaturesPage from '@/pages/Features';
import PricingPage from '@/pages/Pricing';
import PrivacyPage from '@/pages/Privacy';
import TermsPage from '@/pages/Terms';
import NotFoundPage from '@/pages/NotFound';
import FaqPage from '@/pages/Faq';
import SharedInvitationView from '@/components/invitations/SharedInvitationView';

export const publicRoutes = [
  {
    index: true,
    element: <Home />,
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
    path: '*',
    element: <NotFoundPage />,
  },
];

export default publicRoutes;
