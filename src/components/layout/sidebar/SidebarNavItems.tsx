
import { BarChart2, Bell, BookOpen, Calendar, CreditCard, FileText, Home, Mail, MenuIcon, MessageSquare, Settings, ShieldCheck, Users, Clock, Briefcase, FileCheck } from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  plans?: Array<"free" | "individual" | "business">;
  roles?: Array<"admin" | "co-admin" | "staff" | null>;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Appointments",
    href: "/dashboard/appointments",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Contacts",
    href: "/dashboard/contacts",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: <Bell className="h-5 w-5" />,
  },
  // Business plan specific
  {
    title: "Service Management",
    href: "/dashboard/service-management",
    icon: <BookOpen className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  {
    title: "Jobs",
    href: "/dashboard/jobs",
    icon: <Briefcase className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  {
    title: "Job Cards",
    href: "/dashboard/job-cards",
    icon: <FileCheck className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin", "staff"]
  },
  {
    title: "Staff Management",
    href: "/dashboard/staff",
    icon: <Users className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  {
    title: "Work Logs",
    href: "/dashboard/work-logs",
    icon: <Clock className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart2 className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: <ShieldCheck className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  // General
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export { navItems };
export type { NavItem };
