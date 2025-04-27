
import React from "react";
import { RouteObject } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import BusinessDashboard from "@/pages/dashboard/BusinessDashboard";
import MyBusinessPage from "@/pages/business/MyBusinessPage";
import BusinessSettings from "@/pages/settings/BusinessSettings";
import BusinessTasks from "@/pages/tasks/BusinessTasks";
import StaffList from "@/pages/staff/StaffList";
import AddStaff from "@/pages/staff/AddStaff";
import StaffDetails from "@/pages/staff/StaffDetails";
import ChatPage from "@/pages/messages/ChatPage";
import ContactsPage from "@/pages/contacts/ContactsPage";
import AddContactPage from "@/pages/contacts/AddContactPage";
import ContactDetailsPage from "@/pages/contacts/ContactDetailsPage";
import BookingPage from "@/pages/booking/BookingPage";
import ServicesPage from "@/pages/services/ServicesPage";
import ServiceDetailsPage from "@/pages/services/ServiceDetailsPage";
import AddServicePage from "@/pages/services/AddServicePage";
import JobCardsPage from "@/pages/job-cards/JobCardsPage";
import JobCardDetailsPage from "@/pages/job-cards/JobCardDetailsPage";
import AddJobCardPage from "@/pages/job-cards/AddJobCardPage";
import BusinessAIAssistantPage from "@/pages/ai/BusinessAIAssistantPage";

// Business routes for authenticated business users
export const businessRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <DashboardLayout><BusinessDashboard /></DashboardLayout>
  },
  {
    path: "business",
    element: <DashboardLayout><MyBusinessPage /></DashboardLayout>
  },
  {
    path: "settings",
    element: <DashboardLayout><BusinessSettings /></DashboardLayout>
  },
  {
    path: "tasks",
    element: <DashboardLayout><BusinessTasks /></DashboardLayout>
  },
  {
    path: "staff",
    element: <DashboardLayout><StaffList /></DashboardLayout>
  },
  {
    path: "staff/add",
    element: <DashboardLayout><AddStaff /></DashboardLayout>
  },
  {
    path: "staff/:id",
    element: <DashboardLayout><StaffDetails /></DashboardLayout>
  },
  {
    path: "messages",
    element: <DashboardLayout><ChatPage /></DashboardLayout>
  },
  {
    path: "contacts",
    element: <DashboardLayout><ContactsPage /></DashboardLayout>
  },
  {
    path: "contacts/add",
    element: <DashboardLayout><AddContactPage /></DashboardLayout>
  },
  {
    path: "contacts/:id",
    element: <DashboardLayout><ContactDetailsPage /></DashboardLayout>
  },
  {
    path: "ai-assistant",
    element: <DashboardLayout><BusinessAIAssistantPage /></DashboardLayout>
  },
];

// Booking routes
export const bookingRoutes: RouteObject[] = [
  {
    path: "booking",
    element: <DashboardLayout><BookingPage /></DashboardLayout>
  },
  {
    path: "services",
    element: <DashboardLayout><ServicesPage /></DashboardLayout>
  },
  {
    path: "services/add",
    element: <DashboardLayout><AddServicePage /></DashboardLayout>
  },
  {
    path: "services/:id",
    element: <DashboardLayout><ServiceDetailsPage /></DashboardLayout>
  },
  {
    path: "job-cards",
    element: <DashboardLayout><JobCardsPage /></DashboardLayout>
  },
  {
    path: "job-cards/add",
    element: <DashboardLayout><AddJobCardPage /></DashboardLayout>
  },
  {
    path: "job-cards/:id",
    element: <DashboardLayout><JobCardDetailsPage /></DashboardLayout>
  },
];
