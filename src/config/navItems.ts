
import { 
  LayoutDashboard, 
  Calendar, 
  ListChecks, 
  Settings, 
  HelpCircle,
  Building2,
  Store,
  UserPlus,
  PartyPopper,
  BarChart2,
  FileText,
  Bot,
  MessageSquare,
  KanbanSquare
} from "lucide-react";

import React from 'react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permissionKey?: string; // New field for permission checking
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: ListChecks,
    permissionKey: "tasks_view"
  },
  {
    label: "Events",
    href: "/dashboard/events",
    icon: PartyPopper,
    permissionKey: "events_view"
  },
  {
    label: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
    permissionKey: "bookings_view"
  },
  {
    label: "Jobs",
    href: "/dashboard/jobs",
    icon: KanbanSquare,
    permissionKey: "jobs_management"
  },
  {
    label: "Job Cards",
    href: "/dashboard/job-cards",
    icon: FileText,
    permissionKey: "job_cards_view"
  },
  {
    label: "Services",
    href: "/dashboard/services",
    icon: Store,
    permissionKey: "services_management"
  },
  {
    label: "Staff",
    href: "/dashboard/staff",
    icon: UserPlus,
    permissionKey: "staff_management"
  },
  {
    label: "Business Page",
    href: "/dashboard/business-page",
    icon: Building2,
    permissionKey: "business_page_edit"
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart2,
    permissionKey: "analytics_view"
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    permissionKey: "reports_view"
  },
  {
    label: "WAKTI AI",
    href: "/dashboard/ai/assistant",
    icon: Bot,
    permissionKey: "ai_assistant_access"
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings
  },
  {
    label: "Help",
    href: "/dashboard/help",
    icon: HelpCircle
  }
];
