
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

export const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: <ListChecks className="h-4 w-4" />
  },
  {
    label: "Events",
    href: "/dashboard/events",
    icon: <PartyPopper className="h-4 w-4" />
  },
  {
    label: "Bookings",
    href: "/dashboard/bookings",
    icon: <Calendar className="h-4 w-4" />
  },
  {
    label: "Jobs",
    href: "/dashboard/jobs",
    icon: <KanbanSquare className="h-4 w-4" />
  },
  {
    label: "Job Cards",
    href: "/dashboard/job-cards",
    icon: <FileText className="h-4 w-4" />
  },
  {
    label: "Services",
    href: "/dashboard/services",
    icon: <Store className="h-4 w-4" />
  },
  {
    label: "Staff",
    href: "/dashboard/staff",
    icon: <UserPlus className="h-4 w-4" />
  },
  {
    label: "Business Page",
    href: "/dashboard/business-page",
    icon: <Building2 className="h-4 w-4" />
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart2 className="h-4 w-4" />
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: <FileText className="h-4 w-4" />
  },
  {
    label: "WAKTI AI",
    href: "/dashboard/ai/assistant",
    icon: <Bot className="h-4 w-4" />
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: <MessageSquare className="h-4 w-4" />
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />
  },
  {
    label: "Help",
    href: "/dashboard/help",
    icon: <HelpCircle className="h-4 w-4" />
  }
];
