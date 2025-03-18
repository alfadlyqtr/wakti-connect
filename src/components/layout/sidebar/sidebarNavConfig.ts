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
} from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  icon: any;
  badge?: number | null;
  showFor: Array<'free' | 'individual' | 'business'>;
};

export type NavSection = {
  section: string;
  showFor: Array<'free' | 'individual' | 'business'>;
};

export type SidebarNavItem = NavItem | NavSection;

export const navItems: SidebarNavItem[] = [
  {
    section: "Main",
    showFor: ['free', 'individual', 'business'],
  },
  {
    label: "Dashboard",
    path: "",
    icon: LayoutDashboard,
    showFor: ['free', 'individual', 'business'],
  },
  
  {
    section: "Business Tools",
    showFor: ['business'],
  },
  {
    label: "Business Page",
    path: "business-page",
    icon: Building2,
    showFor: ['business'],
  },
  {
    label: "Bookings",
    path: "bookings",
    icon: Calendar,
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
    section: "Tasks & Projects",
    showFor: ['free', 'individual', 'business'],
  },
  {
    label: "Tasks",
    path: "tasks",
    icon: ListChecks,
    showFor: ['free', 'individual', 'business'],
  },
  
  {
    section: "Settings",
    showFor: ['free', 'individual', 'business'],
  },
  {
    label: "Settings",
    path: "settings",
    icon: Settings,
    showFor: ['free', 'individual', 'business'],
  },
  {
    label: "Help",
    path: "help",
    icon: HelpCircle,
    showFor: ['free', 'individual', 'business'],
  },
];
