
import React from 'react';
import { Route } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFound';
import SharedInvitationView from '@/components/invitations/SharedInvitationView';

// Temporary placeholder component for missing pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="container mx-auto px-4 py-16 text-center">
    <h1 className="text-3xl font-bold mb-4">{title} Page</h1>
    <p className="text-muted-foreground">This page is currently under construction.</p>
  </div>
);

// Placeholder components for missing pages
const Home = () => <PlaceholderPage title="Home" />;
const AboutPage = () => <PlaceholderPage title="About" />;
const ContactPage = () => <PlaceholderPage title="Contact" />;
const FeaturesPage = () => <PlaceholderPage title="Features" />;
const PricingPage = () => <PlaceholderPage title="Pricing" />;
const PrivacyPage = () => <PlaceholderPage title="Privacy" />;
const TermsPage = () => <PlaceholderPage title="Terms" />;
const FaqPage = () => <PlaceholderPage title="FAQ" />;

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
