
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { bookingRoutes } from "./businessRoutes"; // Only import bookingRoutes

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Pricing = lazy(() => import("../pages/Pricing"));
const Blog = lazy(() => import("../pages/Blog"));
const BlogArticle = lazy(() => import("../pages/BlogArticle"));
const Events = lazy(() => import("../pages/Events"));
const Legal = lazy(() => import("../pages/Legal"));
const Account = lazy(() => import("../pages/Account"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHome"));
const DashboardInvitations = lazy(() => import("../pages/dashboard/DashboardInvitations"));
const DashboardEvents = lazy(() => import("../pages/dashboard/DashboardEvents"));
const Auth = lazy(() => import("../pages/Auth"));
import { dashboardRoutes } from "./dashboardRoutes";
import SharedEventPage from '@/pages/SharedEventPage';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:article",
    element: <BlogArticle />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/legal",
    element: <Legal />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <DashboardHome />,
      },
      {
        path: "invitations",
        element: <DashboardInvitations />,
      },
      {
        path: "events",
        element: <DashboardEvents />,
      },
      ...dashboardRoutes,
    ],
  },
  {
    path: "/e/:id",
    element: <SharedEventPage />,
  },
  {
    path: "/i/:id",
    element: <SharedEventPage />,
  },
  // Note: We removed the business routes to completely eliminate any business page functionality
];

export default routes;
