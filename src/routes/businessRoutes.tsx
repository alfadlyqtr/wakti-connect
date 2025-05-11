
import { RouteObject } from "react-router-dom";
import BookingPage from "@/pages/booking/BookingPage";
import BookingConfirmationPage from "@/pages/booking/BookingConfirmationPage";
import BusinessLandingPage from "@/pages/business/BusinessLandingPage";
import SimpleBusinessLandingPage from "@/pages/business/SimpleBusinessLandingPage";

// Business routes
export const businessRoutes: RouteObject[] = [
  {
    path: "b/:slug",
    element: <BusinessLandingPage />,
  },
  {
    path: "business/:businessId",
    element: <SimpleBusinessLandingPage />,
  }
];

// Booking routes
export const bookingRoutes: RouteObject[] = [
  {
    path: ":businessId",
    element: <BookingPage />,
  },
  {
    path: ":businessId/:templateId",
    element: <BookingPage />,
  },
  {
    path: "confirmation/:bookingId",
    element: <BookingConfirmationPage />,
  },
];
