
import { RouteObject } from "react-router-dom";
import BusinessPage from "@/pages/business/BusinessLandingPage";

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
