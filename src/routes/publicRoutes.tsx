
import React from 'react';
import LandingPage from '@/pages/landing/LandingPage';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import TermsOfService from '@/pages/legal/TermsOfService';
import HelpdeskPage from '@/pages/helpdesk/HelpdeskPage';
import AboutPage from '@/pages/about/AboutPage';
import ContactPage from '@/pages/contact/ContactPage';
import PricingPage from '@/pages/pricing/PricingPage';
import BlogPage from '@/pages/blog/BlogPage';
import CreateSuperAdmin from '@/components/admin/CreateSuperAdmin';

export const publicRoutes = [
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />
  },
  {
    path: '/terms-of-service',
    element: <TermsOfService />
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
    path: '/blog',
    element: <BlogPage />
  },
  {
    path: '/create-super-admin',
    element: <CreateSuperAdmin />
  }
];
