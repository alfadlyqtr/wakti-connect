
import {
  LayoutDashboard,
  Settings,
  Calendar,
  ListChecks,
  KanbanSquare,
  HelpCircle,
  Building2,
  Scissors,
  UserPlus,
  PartyPopper,
  BarChart2,
  FileText,
  Bot,
  MessageSquare,
  Bookmark
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
    showFor: ['free', 'individual', 'business'],
  },
  {
    label: "Job Cards",
    path: "job-cards",
    icon: FileText,
    showFor: ['staff'],
  },
  {
    label: "Bookings",
    path: "bookings",
    icon: Calendar,
    showFor: ['business', 'staff'],
  },
  {
    label: "Messages",
    path: "messages",
    icon: MessageSquare,
    showFor: ['individual', 'business', 'staff'],
  },
  {
    label: "WAKTI AI",
    path: "ai-assistant",
    icon: Bot,
    showFor: ['free', 'individual', 'business'],
  },
  {
    label: "Business Page",
    path: "business-page",
    icon: Building2,
    showFor: ['business'],
  },
  {
    label: "Services",
    path: "services",
    icon: Scissors,
    showFor: ['business'],
  },
  {
    label: "Staff",
    path: "staff",
    icon: UserPlus,
    showFor: ['business'],
  },
  {
    label: "Jobs",
    path: "jobs",
    icon: KanbanSquare,
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
];
