
import {
  LayoutDashboard,
  Users,
  Settings,
  UserPlus,
  Calendar,
  Mail,
  ListChecks,
  KanbanSquare,
  FileText,
  HelpCircle,
  Contact2,
  Building2,
  Heart,
  BookOpen,
  Scissors,
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

// Combined type for sidebar items
export type SidebarNavItem = NavItem | NavSection;

// Main navigation items
export const navItems: SidebarNavItem[] = [
  // Main section
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
  
  // Business Tools section
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
  
  // Tasks & Projects section
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
    label: "Documents",
    path: "documents",
    icon: FileText,
    showFor: ['free', 'individual', 'business'],
  },
  
  // Communication section
  {
    section: "Communication",
    showFor: ['free', 'individual', 'business'],
  },
  {
    label: "Messages",
    path: "messages",
    icon: Mail,
    showFor: ['free', 'individual', 'business'],
  },
  
  // Contacts & Community section
  {
    section: "Contacts & Community",
    showFor: ['free', 'individual', 'business'],
  },
  {
    label: "Contacts",
    path: "contacts",
    icon: Contact2,
    showFor: ['free', 'individual', 'business'],
  },
  {
    label: "My Subscribers",
    path: "subscribers",
    icon: Users,
    showFor: ['business'],
  },
  {
    label: "My Subscriptions",
    path: "subscriptions",
    icon: Heart,
    showFor: ['free', 'individual'],
  },
  
  // Settings section
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
