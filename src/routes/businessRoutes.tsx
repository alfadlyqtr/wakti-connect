
import { RouteObject, Navigate, useParams } from "react-router-dom";
import BookingPage from "@/pages/booking/BookingPage";
import BookingConfirmationPage from "@/pages/booking/BookingConfirmationPage";

// Redirect component to handle backward compatibility
const BusinessRedirect = () => {
  const params = useParams<{ slug: string }>();
  if (!params.slug) {
    return <Navigate to="/" />;
  }
  return <Navigate to={`/${params.slug}`} />;
};

export const businessRoutes: RouteObject[] = [
  // Business landing page routes removed
];

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
