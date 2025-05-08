
import { RouteObject, Navigate } from "react-router-dom";
import BookingPage from "@/pages/booking/BookingPage";
import BookingConfirmationPage from "@/pages/booking/BookingConfirmationPage";

// Empty business routes - all redirected to home
export const businessRoutes: RouteObject[] = [];

// Booking routes - now completely separate from business routes
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
