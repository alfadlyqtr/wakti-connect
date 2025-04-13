
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
    icon: ListChecks
  },
  {
    label: "Events",
    href: "/dashboard/events",
    icon: PartyPopper
  },
  {
    label: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar
  },
  {
    label: "Jobs",
    href: "/dashboard/jobs",
    icon: KanbanSquare
  },
  {
    label: "Job Cards",
    href: "/dashboard/job-cards",
    icon: FileText
  },
  {
    label: "Services",
    href: "/dashboard/services",
    icon: Store
  },
  {
    label: "Staff",
    href: "/dashboard/staff",
    icon: UserPlus
  },
  {
    label: "Business Page",
    href: "/dashboard/business-page",
    icon: Building2
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart2
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: FileText
  },
  {
    label: "WAKTI AI",
    href: "/dashboard/ai/assistant",
    icon: Bot
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
