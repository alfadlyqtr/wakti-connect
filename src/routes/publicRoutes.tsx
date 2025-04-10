
import React from 'react';
import CreateSuperAdmin from '@/components/admin/CreateSuperAdmin';
import LandingPage from '@/pages/public/LandingPage';
import PricingPage from '@/pages/public/PricingPage';
import FeaturesPage from '@/pages/public/FeaturesPage';
import ContactPage from '@/pages/public/ContactPage';
import AboutPage from '@/pages/public/AboutPage';
import PrivacyPage from '@/pages/public/PrivacyPage';
import TermsPage from '@/pages/public/TermsPage';
import FaqPage from '@/pages/public/FaqPage';

// Placeholder component for the Helpdesk page
const HelpdeskPage = () => <div>Helpdesk Page</div>;

export const publicRoutes = [
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/privacy',
    element: <PrivacyPage />
  },
  {
    path: '/terms',
    element: <TermsPage />
  },
  {
    path: '/help',
    element: <HelpdeskPage />
  },
  {
    path: '/about',
    element: <AboutPage />
  },
  {
    path: '/contact',
    element: <ContactPage />
  },
  {
    path: '/pricing',
    element: <PricingPage />
  },
  {
    path: '/features',
    element: <FeaturesPage />
  },
  {
    path: '/faq',
    element: <FaqPage />
  },
  {
    path: '/create-super-admin',
    element: <CreateSuperAdmin />
  }
];
