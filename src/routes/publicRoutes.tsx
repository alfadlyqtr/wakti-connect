
import React from 'react';
import CreateSuperAdmin from '@/components/admin/CreateSuperAdmin';

// Placeholder components for the missing pages
// These can be replaced with actual implementations later
const LandingPage = () => <div>Landing Page</div>;
const PrivacyPolicy = () => <div>Privacy Policy</div>;
const TermsOfService = () => <div>Terms of Service</div>;
const HelpdeskPage = () => <div>Helpdesk Page</div>;
const AboutPage = () => <div>About Page</div>;
const ContactPage = () => <div>Contact Page</div>;
const PricingPage = () => <div>Pricing Page</div>;
const BlogPage = () => <div>Blog Page</div>;

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
