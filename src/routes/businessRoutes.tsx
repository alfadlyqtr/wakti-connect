
import { RouteObject } from "react-router-dom";
import BookingPage from "@/pages/booking/BookingPage";
import BookingConfirmationPage from "@/pages/booking/BookingConfirmationPage";
import SlugResolver from "@/components/business/SlugResolver";

// Business routes
export const businessRoutes: RouteObject[] = [
  {
    path: ":slug",
    element: <SlugResolver />,
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
