
import { RouteObject } from "react-router-dom";
import LandingPage from "@/pages/public/LandingPage";
import AboutPage from "@/pages/public/AboutPage";
import FeaturesPage from "@/pages/public/FeaturesPage";
import PricingPage from "@/pages/public/PricingPage";
import ContactPage from "@/pages/public/ContactPage";
import FaqPage from "@/pages/public/FaqPage";
import PrivacyPage from "@/pages/public/PrivacyPage";
import TermsPage from "@/pages/public/TermsPage";
import Index from "@/pages/Index";
import BookServicePage from "@/pages/booking/BookServicePage";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/features",
    element: <FeaturesPage />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/faq",
    element: <FaqPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPage />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
  },
  // Removing the /book/:serviceId route to avoid conflicts with booking system
  // This was causing the issue where clicking Book Now redirected to the main WAKTI site
];

export default publicRoutes;
