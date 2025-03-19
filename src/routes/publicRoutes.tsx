
import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const LandingPage = lazy(() => import("@/pages/public/LandingPage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const FeaturesPage = lazy(() => import("@/pages/public/FeaturesPage"));
const PricingPage = lazy(() => import("@/pages/public/PricingPage"));
const ContactPage = lazy(() => import("@/pages/public/ContactPage"));
const FaqPage = lazy(() => import("@/pages/public/FaqPage"));
const TermsPage = lazy(() => import("@/pages/public/TermsPage"));
const PrivacyPage = lazy(() => import("@/pages/public/PrivacyPage"));

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <LandingPage />,
  },
  {
    path: "about",
    element: <AboutPage />,
  },
  {
    path: "features",
    element: <FeaturesPage />,
  },
  {
    path: "pricing",
    element: <PricingPage />,
  },
  {
    path: "contact",
    element: <ContactPage />,
  },
  {
    path: "faq",
    element: <FaqPage />,
  },
  {
    path: "terms",
    element: <TermsPage />,
  },
  {
    path: "privacy",
    element: <PrivacyPage />,
  },
];
