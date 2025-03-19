
import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const BusinessLandingPage = lazy(() => import("@/pages/business/BusinessLandingPage"));

export const businessRoutes: RouteObject[] = [
  {
    index: true,
    element: <BusinessLandingPage />,
  },
];
