
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
// Removed BookingConfirmationPage import as it's now handled in businessRoutes

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
  {
    path: "/book/:serviceId",
    element: <BookServicePage />,
  },
  // Removed duplicate booking confirmation route
];

export default publicRoutes;
