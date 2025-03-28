
import { RouteObject } from "react-router-dom";
import BusinessPage from "@/pages/business/BusinessLandingPage";
import BookingPage from "@/pages/booking/BookingPage";
import BookingConfirmationPage from "@/pages/booking/BookingConfirmationPage";

export const businessRoutes: RouteObject[] = [
  {
    path: ":slug",
    element: <BusinessPage />,
  },
  {
    path: ":slug/preview",
    element: <BusinessPage isPreview={true} />,
  },
];

// Booking routes
export const bookingRoutes: RouteObject[] = [
  {
    path: "booking/:businessId/:templateId",
    element: <BookingPage />,
  },
  {
    path: "booking/confirmation/:bookingId",
    element: <BookingConfirmationPage />,
  },
];
