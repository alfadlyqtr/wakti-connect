import {
  LayoutDashboard,
  Settings,
  Calendar,
  ListChecks,
  KanbanSquare,
  HelpCircle,
  Building2,
  Store,
  UserPlus,
  PartyPopper,
  BarChart2,
  FileText,
  Bot,
  MessageSquare,
  Headphones,
  Mic,
} from "lucide-react";
import { UserRole } from "@/types/user";

export type NavItem = {
  label: string;
  path: string;
  icon: any;
  badge?: number | null;
  showFor: UserRole[];
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "",
    icon: LayoutDashboard,
    showFor: ['free', 'individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Tasks",
    path: "tasks",
    icon: ListChecks,
    showFor: ['free', 'individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Events",
    path: "events",
    icon: PartyPopper,
    showFor: ['free', 'individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Bookings",
    path: "bookings",
    icon: Calendar,
    showFor: ['business', 'staff', 'super-admin'],
  },
  {
    label: "Jobs",
    path: "jobs",
    icon: KanbanSquare,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "Job Cards",
    path: "job-cards",
    icon: FileText,
    showFor: ['staff', 'super-admin'],
  },
  {
    label: "Services",
    path: "services",
    icon: Store,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "Staff",
    path: "staff",
    icon: UserPlus,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "Business Page",
    path: "business-page",
    icon: Building2,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "Analytics",
    path: "analytics",
    icon: BarChart2,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "Reports",
    path: "reports",
    icon: FileText,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "WAKTI AI",
    path: "ai-assistant",
    icon: Bot,
    showFor: ['free', 'individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Settings",
    path: "settings",
    icon: Settings,
    showFor: ['free', 'individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Help",
    path: "help",
    icon: HelpCircle,
    showFor: ['free', 'individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Staff Communication",
    path: "staff-communication",
    icon: Headphones,
    showFor: ['staff', 'super-admin'],
  },
  {
    label: "Meeting Summary",
    path: "meeting-summary",
    icon: Mic,
    showFor: ['free', 'individual', 'business', 'staff', 'super-admin'],
  },
];

// Items moved to dropdown menu - these are not in sidebar
export const dropdownNavItems: NavItem[] = [
  {
    label: "Messages",
    path: "messages",
    icon: MessageSquare,
    showFor: ['free', 'individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Subscribers",
    path: "subscribers",
    icon: UserPlus,
    showFor: ['business', 'super-admin'],
  },
];
