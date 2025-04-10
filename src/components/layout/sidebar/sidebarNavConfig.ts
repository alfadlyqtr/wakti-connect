
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
  Headphones
} from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  icon: any;
  badge?: number | null;
  showFor: Array<'free' | 'individual' | 'business' | 'staff'>;
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "",
    icon: LayoutDashboard,
    showFor: ['free', 'individual', 'business', 'staff'],
  },
  {
    label: "Tasks",
    path: "tasks",
    icon: ListChecks,
    showFor: ['free', 'individual', 'business', 'staff'],
  },
  {
    label: "Events",
    path: "events",
    icon: PartyPopper,
    showFor: ['free', 'individual', 'business', 'staff'],
  },
  {
    label: "Bookings",
    path: "bookings",
    icon: Calendar,
    showFor: ['business', 'staff'],
  },
  {
    label: "Jobs",
    path: "jobs",
    icon: KanbanSquare,
    showFor: ['business'],
  },
  {
    label: "Job Cards",
    path: "job-cards",
    icon: FileText,
    showFor: ['staff'],
  },
  {
    label: "Services",
    path: "services",
    icon: Store,
    showFor: ['business'],
  },
  {
    label: "Staff",
    path: "staff",
    icon: UserPlus,
    showFor: ['business'],
  },
  {
    label: "WAKTI AI",
    path: "ai-assistant",
    icon: Bot,
    showFor: ['free', 'individual', 'business', 'staff'],
  },
  {
    label: "Settings",
    path: "settings",
    icon: Settings,
    showFor: ['free', 'individual', 'business', 'staff'],
  },
  {
    label: "Help",
    path: "help",
    icon: HelpCircle,
    showFor: ['free', 'individual', 'business', 'staff'],
  },
  {
    label: "Staff Communication",
    path: "staff-communication",
    icon: Headphones,
    showFor: ['staff'],
  },
];

// Items moved to dropdown menu - these are not in sidebar
export const dropdownNavItems: NavItem[] = [
  {
    label: "Messages",
    path: "messages",
    icon: MessageSquare,
    showFor: ['free', 'individual', 'business', 'staff'],
  },
  {
    label: "Business Page",
    path: "business-page",
    icon: Building2,
    showFor: ['business'],
  },
  {
    label: "Subscribers",
    path: "subscribers",
    icon: UserPlus,
    showFor: ['business'],
  },
  {
    label: "Analytics",
    path: "analytics",
    icon: BarChart2,
    showFor: ['business'],
  },
  {
    label: "Reports",
    path: "reports",
    icon: FileText,
    showFor: ['business'],
  },
];
