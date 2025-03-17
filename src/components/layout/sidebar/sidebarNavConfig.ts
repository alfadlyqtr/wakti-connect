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
} from "lucide-react";

export type SidebarItem = {
  title: string;
  href: string;
  icon: any;
  disabled?: boolean;
  accountTypes: string[];
};

export const sidebarNavItems: SidebarItem[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        accountTypes: ["individual", "business"],
      },
    ],
  },
  {
    title: "Business Tools",
    items: [
      {
        title: "Business Page",
        href: "/dashboard/business-page",
        icon: Building2,
        accountTypes: ["business"],
      },
      {
        title: "Bookings",
        href: "/dashboard/bookings",
        icon: Calendar,
        accountTypes: ["business"],
      },
      {
        title: "Services",
        href: "/dashboard/services",
        icon: ListChecks,
        accountTypes: ["business"],
      },
      {
        title: "Staff",
        href: "/dashboard/staff",
        icon: UserPlus,
        accountTypes: ["business"],
      },
      {
        title: "Jobs",
        href: "/dashboard/jobs",
        icon: KanbanSquare,
        accountTypes: ["business"],
      },
    ],
  },
  {
    title: "Tasks & Projects",
    items: [
      {
        title: "Tasks",
        href: "/dashboard/tasks",
        icon: ListChecks,
        accountTypes: ["individual", "business"],
      },
      {
        title: "Documents",
        href: "/dashboard/documents",
        icon: FileText,
        accountTypes: ["individual", "business"],
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Messages",
        href: "/dashboard/messages",
        icon: Mail,
        accountTypes: ["individual", "business"],
      },
      {
        title: "Contacts",
        href: "/dashboard/contacts",
        icon: Contact2,
        accountTypes: ["individual", "business"],
      },
    ],
  },
  {
    title: "Contacts & Community",
    items: [
      {
        title: "Contacts",
        href: "/dashboard/contacts",
        icon: Users,
        accountTypes: ["individual", "business"],
      },
      {
        title: "My Subscribers",
        href: "/dashboard/subscribers",
        icon: Users,
        accountTypes: ["business"],
      },
      {
        title: "My Subscriptions",
        href: "/dashboard/subscriptions",
        icon: Heart,
        accountTypes: ["individual", "free"],
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        accountTypes: ["individual", "business"],
      },
      {
        title: "Help",
        href: "/dashboard/help",
        icon: HelpCircle,
        accountTypes: ["individual", "business"],
      },
    ],
  },
];
