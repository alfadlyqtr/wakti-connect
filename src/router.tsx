import React, { lazy } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { authRoutes, publicRoutes, businessRoutes, bookingRoutes, superadminRoutes } from "./routes";

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

// Create the router with all the routes
export const router = createBrowserRouter([
  // Public routes (landing pages, auth, etc.)
  {
    path: "/",
    children: publicRoutes,
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
]);
