
import { RouteObject, Navigate, useParams } from "react-router-dom";
import SimpleBusinessLandingPage from "@/pages/business/SimpleBusinessLandingPage";
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
  {
    path: ":slug",
    element: <SimpleBusinessLandingPage />,
  },
  {
    path: ":slug/preview",
    element: <SimpleBusinessLandingPage isPreview={true} />,
  },
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
